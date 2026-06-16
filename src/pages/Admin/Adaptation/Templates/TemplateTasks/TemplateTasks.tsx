import { JSX, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IconButton from "@/components/ui/custom/IconButton";
import DataMessage from "@/components/ui/custom/DataMessage";
import Input from "@/components/ui/custom/Input";
import Loader from "@/components/ui/custom/Loader";
import {
  useDeleteAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplatesQuery,
  useUpdateAdaptationPlanTemplateMutation,
} from "@/services/store/features/user.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import FormActionStatus from "@/components/ui/custom/FormActionStatus";

type ResponsibleRole = "Руководитель отдела" | "Наставник" | "Сотрудник УПиПК";

type ResponsibleRoleForm = ResponsibleRole | "";

interface TaskRule {
  description: string;
  responsible_role: ResponsibleRole;
  day_from?: number | null;
  day_to?: number | null;
  links: string[];
}

interface AdaptationPlanTemplateType {
  id: number;
  name: string;
  work_schedule: string;
  shifts: number[];
  task_blueprint?: TaskRule[];
}

interface TaskRuleForm {
  description: string;
  responsible_role: ResponsibleRoleForm;
  day_from?: string;
  day_to?: string;
  links: string;
}

interface GroupedRuleBlock {
  key: string;
  title: string;
  dayFrom: string;
  dayTo: string;
  items: Array<{ rule: TaskRuleForm; index: number }>;
}

type StatusType = "idle" | "loading" | "success" | "error";

const EMPTY_RULE: TaskRuleForm = {
  description: "",
  responsible_role: "",
  links: "",
};

function toFormRule(rule: TaskRule): TaskRuleForm {
  return {
    description: rule.description,
    responsible_role: rule.responsible_role,
    day_from: rule.day_from ? String(rule.day_from) : "",
    day_to: rule.day_to ? String(rule.day_to) : "",
    links: (rule.links ?? []).join(", "),
  };
}

function toPayloadRule(rule: TaskRuleForm): TaskRule {
  const responsible_role = rule.responsible_role;
  if (!responsible_role) {
    throw new Error("Responsible role required");
  }

  return {
    description: rule.description.trim(),
    responsible_role,
    day_from: rule.day_from ? Number(rule.day_from) : null,
    day_to: rule.day_to ? Number(rule.day_to) : null,
    links: rule.links
      .split(",")
      .map((link) => link.trim())
      .filter(Boolean),
  };
}

function TemplateTasks(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const templateId = Number(params.templateId);
  const {
    data = [],
    isLoading,
    isError,
  } = useGetAdaptationPlanTemplatesQuery(undefined);
  const [updateTemplate, { isLoading: isSaving }] =
    useUpdateAdaptationPlanTemplateMutation();
  const [deleteTemplate, { isLoading: isDeletingTemplate }] =
    useDeleteAdaptationPlanTemplateMutation();
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [createRules, setCreateRules] = useState<TaskRuleForm[]>([
    { ...EMPTY_RULE },
  ]);
  const [createDayFrom, setCreateDayFrom] = useState<string>("");
  const [createDayTo, setCreateDayTo] = useState<string>("");
  const [editingGroupKey, setEditingGroupKey] = useState<string | null>(null);
  const [editingGroupRules, setEditingGroupRules] = useState<TaskRuleForm[]>(
    [],
  );
  const [editingGroupIndexes, setEditingGroupIndexes] = useState<number[]>([]);
  const [editingGroupDayFrom, setEditingGroupDayFrom] = useState<string>("");
  const [editingGroupDayTo, setEditingGroupDayTo] = useState<string>("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("idle");

  const templates = data as AdaptationPlanTemplateType[];
  const template = useMemo(
    () => templates.find((item) => item.id === templateId),
    [templates, templateId],
  );

  const rules = useMemo(
    () => (template?.task_blueprint ?? []).map((item) => toFormRule(item)),
    [template],
  );

  const groupedRules = useMemo<GroupedRuleBlock[]>(() => {
    const map = new Map<string, GroupedRuleBlock>();

    rules.forEach((rule, index) => {
      const dayFrom = rule.day_from || "";
      const dayTo = rule.day_to || "";
      const key = `${dayFrom}:${dayTo}`;

      if (!map.has(key)) {
        const title = dayFrom
          ? dayTo
            ? `Дни ${dayFrom}-${dayTo}`
            : `День ${dayFrom}`
          : "Все дни";
        map.set(key, { key, title, dayFrom, dayTo, items: [] });
      }

      map.get(key)?.items.push({ rule, index });
    });

    return Array.from(map.values());
  }, [rules]);

  const saveRules = async (nextRules: TaskRuleForm[]) => {
    if (!template) {
      return;
    }

    const payloadRules = nextRules
      .map(toPayloadRule)
      .filter((rule) => rule.description.length > 0);

    await updateTemplate({
      id: template.id,
      name: template.name,
      work_schedule: template.work_schedule,
      shifts: template.shifts,
      task_blueprint: payloadRules,
    }).unwrap();
  };

  const addCreateRule = () => {
    setCreateRules((previous) => [...previous, { ...EMPTY_RULE }]);
  };

  const updateCreateRule = (index: number, nextRule: TaskRuleForm) => {
    const nextRules = [...createRules];
    nextRules[index] = nextRule;
    setCreateRules(nextRules);
  };

  const removeCreateRule = (index: number) => {
    if (createRules.length === 1) {
      setCreateRules([{ ...EMPTY_RULE }]);
      return;
    }

    setCreateRules((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const saveCreateRules = async () => {
    const preparedRules = createRules.filter(
      (rule) => rule.description.trim().length > 0,
    );
    if (!preparedRules.length) {
      setStatusType("error");
      setStatus("Добавьте хотя бы одну задачу с описанием.");
      return;
    }

    if (preparedRules.some((rule) => !rule.responsible_role)) {
      setStatusType("error");
      setStatus("Выберите ответственного для каждой задачи.");
      return;
    }

    const normalized = preparedRules.map((rule) => ({
      ...rule,
      day_from: createDayFrom,
      day_to: createDayTo,
    }));

    try {
      setStatusType("loading");
      setStatus(FORM_STATUS_MESSAGES.saveLoading);
      await saveRules([...rules, ...normalized]);
      setCreateRules([{ ...EMPTY_RULE }]);
      setCreateDayFrom("");
      setCreateDayTo("");
      setIsCreateVisible(false);
      setStatusType("success");
      setStatus(FORM_STATUS_MESSAGES.createSuccess);
    } catch {
      setStatusType("error");
      setStatus(FORM_STATUS_MESSAGES.saveError);
    }
  };

  const startEditGroup = (group: GroupedRuleBlock) => {
    setEditingGroupKey(group.key);
    setEditingGroupRules(group.items.map((item) => ({ ...item.rule })));
    setEditingGroupIndexes(group.items.map((item) => item.index));
    setEditingGroupDayFrom(group.dayFrom);
    setEditingGroupDayTo(group.dayTo);
  };

  const updateEditingGroupRule = (index: number, nextRule: TaskRuleForm) => {
    const nextRules = [...editingGroupRules];
    nextRules[index] = nextRule;
    setEditingGroupRules(nextRules);
  };

  const addEditingGroupRule = () => {
    setEditingGroupRules((previous) => [...previous, { ...EMPTY_RULE }]);
  };

  const removeEditingGroupRule = (index: number) => {
    if (editingGroupRules.length === 1) {
      setEditingGroupRules([{ ...EMPTY_RULE }]);
      return;
    }

    setEditingGroupRules((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const saveEditGroup = async () => {
    const prepared = editingGroupRules.filter(
      (rule) => rule.description.trim().length > 0,
    );
    if (!prepared.length) {
      setStatusType("error");
      setStatus("Добавьте хотя бы одну задачу с описанием.");
      return;
    }

    if (prepared.some((rule) => !rule.responsible_role)) {
      setStatusType("error");
      setStatus("Выберите ответственного для каждой задачи.");
      return;
    }

    const normalized = prepared.map((rule) => ({
      ...rule,
      day_from: editingGroupDayFrom,
      day_to: editingGroupDayTo,
    }));

    const nextRules = rules.filter(
      (_, index) => !editingGroupIndexes.includes(index),
    );
    nextRules.push(...normalized);

    try {
      setStatusType("loading");
      setStatus(FORM_STATUS_MESSAGES.saveLoading);
      await saveRules(nextRules);
      setEditingGroupKey(null);
      setEditingGroupRules([]);
      setEditingGroupIndexes([]);
      setStatusType("success");
      setStatus(FORM_STATUS_MESSAGES.saveSuccess);
    } catch {
      setStatusType("error");
      setStatus(FORM_STATUS_MESSAGES.saveError);
    }
  };

  const deleteGroup = async (indexes: number[]) => {
    const nextRules = rules.filter(
      (_, currentIndex) => !indexes.includes(currentIndex),
    );

    try {
      setStatusType("loading");
      setStatus(FORM_STATUS_MESSAGES.deleteLoading);
      await saveRules(nextRules);
      if (editingGroupKey !== null) {
        setEditingGroupKey(null);
        setEditingGroupRules([]);
        setEditingGroupIndexes([]);
      }
      setStatusType("success");
      setStatus(FORM_STATUS_MESSAGES.deleteSuccess);
    } catch {
      setStatusType("error");
      setStatus(FORM_STATUS_MESSAGES.deleteError);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!template) {
      return;
    }

    const confirmed = window.confirm("Удалить шаблон адаптации?");
    if (!confirmed) {
      return;
    }

    try {
      setStatusType("loading");
      setStatus(FORM_STATUS_MESSAGES.deleteLoading);
      await deleteTemplate(template.id).unwrap();
      navigate("/admin/adaptation/templates");
    } catch {
      setStatusType("error");
      setStatus(FORM_STATUS_MESSAGES.deleteError);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !template) {
    return <DataMessage type="error" />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-[0.9rem] overflow-hidden">
      <div className="sticky top-0 z-[2] flex flex-col gap-[0.6rem] bg-[var(--mfc-create-form-bg)] pb-[0.15rem]">
        <div className="flex items-center justify-between gap-[0.8rem] rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-create-form-bg)] p-3 max-[1000px]:flex-col max-[1000px]:items-start">
          <div>
            <p className="mb-1 text-[var(--mfc-gray-color)]">
              План: {template.name}
            </p>
            <p className="mb-1 text-[var(--mfc-gray-color)]">
              График: {template.work_schedule}
            </p>
            <p className="mb-1 text-[var(--mfc-gray-color)]">
              Смены: {template.shifts.join(", ")}
            </p>
          </div>
          <div className="flex items-center justify-center self-stretch max-[1000px]:self-start">
            <IconButton
              type="delete"
              onClick={handleDeleteTemplate}
              disabled={isDeletingTemplate}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-[0.8rem]">
          <div className="flex items-center gap-2">
            {isCreateVisible ? (
              <IconButton
                type="close"
                onClick={() => {
                  setIsCreateVisible(false);
                  setCreateRules([{ ...EMPTY_RULE }]);
                  setCreateDayFrom("");
                  setCreateDayTo("");
                }}
              />
            ) : (
              <IconButton
                type="edit"
                onClick={() => setIsCreateVisible(true)}
              />
            )}
            <FormActionStatus type={statusType} message={status} />
          </div>
        </div>
      </div>

      {isCreateVisible && (
        <div className="flex flex-col gap-[0.7rem] rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-create-form-bg)] p-[0.9rem]">
          <p className="m-0 text-base font-semibold">Новые задачи</p>
          <div className="grid grid-cols-[minmax(7rem,10rem)_minmax(9rem,12rem)] justify-start gap-2 max-[1000px]:grid-cols-1">
            <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
              День
              <Input
                name="createDayFrom"
                className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                type="number"
                min={1}
                value={createDayFrom}
                onChange={(event) => setCreateDayFrom(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
              До дня (опционально)
              <Input
                name="createDayTo"
                className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                type="number"
                min={1}
                value={createDayTo}
                onChange={(event) => setCreateDayTo(event.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            className="inline-flex h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-[var(--mfc-create-field-border)] bg-[var(--mfc-create-form-bg)] px-[0.9rem] text-sm leading-none text-[var(--mfc-black-color)]"
            onClick={addCreateRule}
          >
            + Задача
          </button>
          {createRules.map((rule, index) => (
            <div
              key={`create-rule-${index}`}
              className="grid grid-cols-[minmax(0,1fr)_minmax(12rem,0.65fr)_minmax(12rem,0.75fr)_auto] items-end gap-2 max-[1000px]:grid-cols-[minmax(0,1fr)_minmax(8rem,0.6fr)_minmax(8rem,0.7fr)_auto]"
            >
              <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
                Описание задачи
                <Input
                  name={`createDescription-${index}`}
                  type="text"
                  className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                  value={rule.description}
                  onChange={(event) =>
                    updateCreateRule(index, {
                      ...rule,
                      description: event.target.value,
                    })
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
                Ответственный
                <select
                  className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                  value={rule.responsible_role}
                  onChange={(event) =>
                    updateCreateRule(index, {
                      ...rule,
                      responsible_role: event.target
                        .value as ResponsibleRoleForm,
                    })
                  }
                >
                  <option value="" disabled>
                    Выберите ответственного
                  </option>
                  <option value="Наставник">Наставник</option>
                  <option value="Сотрудник УПиПК">Сотрудник УПиПК</option>
                  <option value="Руководитель отдела">
                    Руководитель отдела
                  </option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
                Ссылки
                <Input
                  name={`createLinks-${index}`}
                  type="text"
                  className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                  value={rule.links}
                  onChange={(event) =>
                    updateCreateRule(index, {
                      ...rule,
                      links: event.target.value,
                    })
                  }
                />
              </label>
              <div className="flex items-center justify-end self-end pb-0.5">
                <IconButton
                  type="delete"
                  onClick={() => removeCreateRule(index)}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <IconButton
              type="save"
              onClick={saveCreateRules}
              disabled={isSaving}
            />
            <IconButton
              type="close"
              onClick={() => {
                setIsCreateVisible(false);
                setCreateRules([{ ...EMPTY_RULE }]);
                setCreateDayFrom("");
                setCreateDayTo("");
              }}
            />
          </div>
        </div>
      )}

      {rules.length === 0 && <DataMessage type="noData" />}
      {rules.length > 0 && (
        <div className="flex min-h-0 flex-1 flex-col gap-[0.8rem] overflow-y-auto pr-1">
          {groupedRules.map((group) => (
            <div
              key={`rule-group-${group.key}`}
              className="flex flex-col gap-[0.7rem] rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-create-form-bg)] p-[0.9rem]"
            >
              <p className="m-0 text-base font-semibold">{group.title}</p>
              {editingGroupKey === group.key ? (
                <>
                  <div className="grid grid-cols-[minmax(7rem,10rem)_minmax(9rem,12rem)] justify-start gap-2 max-[1000px]:grid-cols-1">
                    <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
                      День
                      <Input
                        name="editDayFrom"
                        className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                        type="number"
                        min={1}
                        value={editingGroupDayFrom}
                        onChange={(event) =>
                          setEditingGroupDayFrom(event.target.value)
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
                      До дня (опционально)
                      <Input
                        name="editDayTo"
                        className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                        type="number"
                        min={1}
                        value={editingGroupDayTo}
                        onChange={(event) =>
                          setEditingGroupDayTo(event.target.value)
                        }
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-[var(--mfc-create-field-border)] bg-[var(--mfc-create-form-bg)] px-[0.9rem] text-sm leading-none text-[var(--mfc-black-color)]"
                    onClick={addEditingGroupRule}
                  >
                    + Задача
                  </button>
                  {editingGroupRules.map((rule, index) => (
                    <div
                      key={`edit-rule-${index}`}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(12rem,0.65fr)_minmax(12rem,0.75fr)_auto] items-end gap-2 max-[1000px]:grid-cols-[minmax(0,1fr)_minmax(8rem,0.6fr)_minmax(8rem,0.7fr)_auto]"
                    >
                      <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
                        Описание задачи
                        <Input
                          name={`editDescription-${index}`}
                          type="text"
                          className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                          value={rule.description}
                          onChange={(event) =>
                            updateEditingGroupRule(index, {
                              ...rule,
                              description: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
                        Ответственный
                        <select
                          className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                          value={rule.responsible_role}
                          onChange={(event) =>
                            updateEditingGroupRule(index, {
                              ...rule,
                              responsible_role: event.target
                                .value as ResponsibleRoleForm,
                            })
                          }
                        >
                          <option value="" disabled>
                            Выберите ответственного
                          </option>
                          <option value="Наставник">Наставник</option>
                          <option value="Сотрудник УПиПК">
                            Сотрудник УПиПК
                          </option>
                          <option value="Руководитель отдела">
                            Руководитель отдела
                          </option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-1 text-[0.85rem] text-[var(--mfc-black-color)]">
                        Ссылки
                        <Input
                          name={`editLinks-${index}`}
                          type="text"
                          className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                          value={rule.links}
                          onChange={(event) =>
                            updateEditingGroupRule(index, {
                              ...rule,
                              links: event.target.value,
                            })
                          }
                        />
                      </label>
                      <div className="flex items-center justify-end self-end pb-0.5">
                        <IconButton
                          type="delete"
                          onClick={() => removeEditingGroupRule(index)}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <IconButton
                      type="save"
                      onClick={saveEditGroup}
                      disabled={isSaving}
                    />
                    <IconButton
                      type="delete"
                      onClick={() => deleteGroup(editingGroupIndexes)}
                      disabled={isSaving}
                    />
                    <IconButton
                      type="close"
                      onClick={() => {
                        setEditingGroupKey(null);
                        setEditingGroupRules([]);
                        setEditingGroupIndexes([]);
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {group.items.map((item, index) => (
                    <div
                      key={`group-item-${group.key}-${index}`}
                      className="rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-create-form-bg)] p-3"
                    >
                      <p className="mb-1 text-[var(--mfc-gray-color)]">
                        {item.rule.description}
                      </p>
                      <p className="mb-1 text-[var(--mfc-gray-color)]">
                        Ответственный: {item.rule.responsible_role}
                      </p>
                      <p className="mb-1 text-[var(--mfc-gray-color)]">
                        Ссылки: {item.rule.links || "—"}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <IconButton
                      type="edit"
                      onClick={() => startEditGroup(group)}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplateTasks;
