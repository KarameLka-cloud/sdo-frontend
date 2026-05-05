import { JSX, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import Input from "@components/ui/Input/Input.tsx";
import Loader from "@components/ui/Loader/Loader.tsx";
import {
  useDeleteAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplatesQuery,
  useUpdateAdaptationPlanTemplateMutation,
} from "@services/store/features/user.ts";
import { FORM_STATUS_MESSAGES } from "@constants/formStatus.ts";
import FormActionStatus from "@components/ui/FormActionStatus/FormActionStatus.tsx";
import styles from "./TemplateTasks.module.css";

type ResponsibleRole =
  | "Руководитель отдела"
  | "Наставник"
  | "Сотрудник УПиПК";

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
  const { data = [], isLoading, isError } = useGetAdaptationPlanTemplatesQuery(undefined);
  const [updateTemplate, { isLoading: isSaving }] = useUpdateAdaptationPlanTemplateMutation();
  const [deleteTemplate, { isLoading: isDeletingTemplate }] =
    useDeleteAdaptationPlanTemplateMutation();
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [createRules, setCreateRules] = useState<TaskRuleForm[]>([{ ...EMPTY_RULE }]);
  const [createDayFrom, setCreateDayFrom] = useState<string>("");
  const [createDayTo, setCreateDayTo] = useState<string>("");
  const [editingGroupKey, setEditingGroupKey] = useState<string | null>(null);
  const [editingGroupRules, setEditingGroupRules] = useState<TaskRuleForm[]>([]);
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

    setCreateRules((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  };

  const saveCreateRules = async () => {
    const preparedRules = createRules.filter((rule) => rule.description.trim().length > 0);
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

    setEditingGroupRules((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  };

  const saveEditGroup = async () => {
    const prepared = editingGroupRules.filter((rule) => rule.description.trim().length > 0);
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

    const nextRules = rules.filter((_, index) => !editingGroupIndexes.includes(index));
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
    const nextRules = rules.filter((_, currentIndex) => !indexes.includes(currentIndex));

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
    return (
      <OverflowScrollBlock
        header_name={"Редактирование плана адаптации"}
        button_back_visible={"enable"}
      >
        <Loader />
      </OverflowScrollBlock>
    );
  }

  if (isError || !template) {
    return (
      <OverflowScrollBlock
        header_name={"Редактирование плана адаптации"}
        button_back_visible={"enable"}
      >
        <DataMessage type="error" />
      </OverflowScrollBlock>
    );
  }

  return (
    <OverflowScrollBlock
      header_name={"Редактирование плана адаптации"}
      button_back_visible={"enable"}
    >
      <div className={styles.container}>
        <div className={styles.stickyHeader}>
          <div className={styles.templateMetaBlock}>
            <div>
              <p className={styles.meta}>План: {template.name}</p>
              <p className={styles.meta}>График: {template.work_schedule}</p>
              <p className={styles.meta}>Смены: {template.shifts.join(", ")}</p>
            </div>
            <div className={styles.metaActions}>
              <IconButton
                type="delete"
                onClick={handleDeleteTemplate}
                disabled={isDeletingTemplate}
              />
            </div>
          </div>

          <div className={styles.topBar}>
            <div className={styles.topBarActions}>
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
                <IconButton type="edit" onClick={() => setIsCreateVisible(true)} />
              )}
            </div>
            <FormActionStatus type={statusType} message={status} />
          </div>
        </div>

        {isCreateVisible && (
          <div className={styles.ruleCard}>
            <p className={styles.title}>Новые задачи</p>
            <div className={`${styles.row} ${styles.dayRangeRow}`}>
              <label className={styles.label}>
                День
                <Input
                  name="createDayFrom"
                  className={styles.input}
                  type="number"
                  min={1}
                  value={createDayFrom}
                  onChange={(event) => setCreateDayFrom(event.target.value)}
                />
              </label>
              <label className={styles.label}>
                До дня (опционально)
                <Input
                  name="createDayTo"
                  className={styles.input}
                  type="number"
                  min={1}
                  value={createDayTo}
                  onChange={(event) => setCreateDayTo(event.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className={`${styles.secondaryButton} ${styles.addTaskButton}`}
              onClick={addCreateRule}
            >
              + Задача
            </button>
            {createRules.map((rule, index) => (
              <div key={`create-rule-${index}`} className={`${styles.row} ${styles.taskRow}`}>
                <label className={styles.label}>
                  Описание задачи
                  <Input
                    name={`createDescription-${index}`}
                    type="text"
                    className={styles.input}
                    value={rule.description}
                    onChange={(event) =>
                      updateCreateRule(index, { ...rule, description: event.target.value })
                    }
                  />
                </label>
                <label className={styles.label}>
                  Ответственный
                  <select
                    className={styles.input}
                    value={rule.responsible_role}
                    onChange={(event) =>
                      updateCreateRule(index, {
                        ...rule,
                        responsible_role: event.target.value as ResponsibleRoleForm,
                      })
                    }
                  >
                    <option value="" disabled>
                      Выберите ответственного
                    </option>
                    <option value="Наставник">Наставник</option>
                    <option value="Сотрудник УПиПК">Сотрудник УПиПК</option>
                    <option value="Руководитель отдела">Руководитель отдела</option>
                  </select>
                </label>
                <label className={styles.label}>
                  Ссылки
                  <Input
                    name={`createLinks-${index}`}
                    type="text"
                    className={styles.input}
                    value={rule.links}
                    onChange={(event) =>
                      updateCreateRule(index, { ...rule, links: event.target.value })
                    }
                  />
                </label>
                <div className={styles.inlineActions}>
                  <IconButton type="delete" onClick={() => removeCreateRule(index)} />
                </div>
              </div>
            ))}
            <div className={styles.actions}>
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
          <div className={styles.list}>
            {groupedRules.map((group) => (
              <div key={`rule-group-${group.key}`} className={styles.ruleCard}>
                <p className={styles.title}>{group.title}</p>
                {editingGroupKey === group.key ? (
                  <>
                    <div className={`${styles.row} ${styles.dayRangeRow}`}>
                      <label className={styles.label}>
                        День
                        <Input
                          name="editDayFrom"
                          className={styles.input}
                          type="number"
                          min={1}
                          value={editingGroupDayFrom}
                          onChange={(event) => setEditingGroupDayFrom(event.target.value)}
                        />
                      </label>
                      <label className={styles.label}>
                        До дня (опционально)
                        <Input
                          name="editDayTo"
                          className={styles.input}
                          type="number"
                          min={1}
                          value={editingGroupDayTo}
                          onChange={(event) => setEditingGroupDayTo(event.target.value)}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className={`${styles.secondaryButton} ${styles.addTaskButton}`}
                      onClick={addEditingGroupRule}
                    >
                      + Задача
                    </button>
                    {editingGroupRules.map((rule, index) => (
                    <div key={`edit-rule-${index}`} className={`${styles.row} ${styles.taskRow}`}>
                      <label className={styles.label}>
                        Описание задачи
                        <Input
                          name={`editDescription-${index}`}
                          type="text"
                          className={styles.input}
                          value={rule.description}
                          onChange={(event) =>
                            updateEditingGroupRule(index, {
                              ...rule,
                              description: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label className={styles.label}>
                        Ответственный
                        <select
                          className={styles.input}
                          value={rule.responsible_role}
                          onChange={(event) =>
                            updateEditingGroupRule(index, {
                              ...rule,
                              responsible_role: event.target.value as ResponsibleRoleForm,
                            })
                          }
                        >
                          <option value="" disabled>
                            Выберите ответственного
                          </option>
                          <option value="Наставник">Наставник</option>
                          <option value="Сотрудник УПиПК">Сотрудник УПиПК</option>
                          <option value="Руководитель отдела">Руководитель отдела</option>
                        </select>
                      </label>
                      <label className={styles.label}>
                        Ссылки
                        <Input
                          name={`editLinks-${index}`}
                          type="text"
                          className={styles.input}
                          value={rule.links}
                          onChange={(event) =>
                            updateEditingGroupRule(index, { ...rule, links: event.target.value })
                          }
                        />
                      </label>
                      <div className={styles.inlineActions}>
                        <IconButton type="delete" onClick={() => removeEditingGroupRule(index)} />
                      </div>
                    </div>
                    ))}
                    <div className={styles.actions}>
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
                      <div key={`group-item-${group.key}-${index}`} className={styles.metaBlock}>
                        <p className={styles.meta}>{item.rule.description}</p>
                        <p className={styles.meta}>Ответственный: {item.rule.responsible_role}</p>
                        <p className={styles.meta}>Ссылки: {item.rule.links || "—"}</p>
                      </div>
                    ))}
                    <div className={styles.actions}>
                      <IconButton type="edit" onClick={() => startEditGroup(group)} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </OverflowScrollBlock>
  );
}

export default TemplateTasks;
