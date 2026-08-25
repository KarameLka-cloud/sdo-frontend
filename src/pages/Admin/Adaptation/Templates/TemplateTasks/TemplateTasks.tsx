import { FormEvent, JSX, useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useDeleteAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplateByIdQuery,
  useUpdateAdaptationPlanTemplateMutation,
} from "@/services/store/features/user.ts";
import ResourceFormPage from "@/components/resource-list/ResourceFormPage";
import {
  TEMPLATE_ROUTES,
  WORK_SCHEDULE_OPTIONS,
  parseEntityId,
} from "@/components/resource-list/resourceRoutes";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import { usePopulateEditForm } from "@/components/resource-list/usePopulateEditForm";
import { firstShift } from "@/utils/formatShifts.ts";
import { AdaptationPlanTemplateType } from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import CreateTaskRulesCard from "./CreateTaskRulesCard";
import TaskRuleGroup from "./TaskRuleGroup";
import TemplateMetadataCard from "./TemplateMetadataCard";
import {
  EMPTY_RULE,
  GroupedRuleBlock,
  TaskRule,
  TaskRuleForm,
  groupTaskRules,
  toFormRule,
  toPayloadRule,
} from "./taskRuleForm";

const DELETE_MESSAGES = {
  confirm: "Удалить шаблон адаптации?",
  success: "Шаблон адаптации удалён",
  error: "Не удалось удалить шаблон",
};

function TemplateTasks(): JSX.Element {
  const navigate = useNavigate();
  const { templateId: templateIdParam } = useParams();
  const templateId = parseEntityId(templateIdParam) ?? 0;

  const {
    data: template,
    isLoading,
    isError,
  } = useGetAdaptationPlanTemplateByIdQuery(templateId, {
    skip: templateId <= 0,
  });
  const [updateTemplate, { isLoading: isSaving }] =
    useUpdateAdaptationPlanTemplateMutation();
  const deleteMutation = useDeleteAdaptationPlanTemplateMutation();
  const { handleDelete, isDeleting } = useConfirmDelete(deleteMutation, {
    messages: DELETE_MESSAGES,
    onSuccess: () => navigate(TEMPLATE_ROUTES.list),
    trackId: false,
  });

  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [createRules, setCreateRules] = useState<TaskRuleForm[]>([
    { ...EMPTY_RULE },
  ]);
  const [createDayFrom, setCreateDayFrom] = useState("");
  const [createDayTo, setCreateDayTo] = useState("");
  const [editingGroupKey, setEditingGroupKey] = useState<string | null>(null);
  const [editingGroupRules, setEditingGroupRules] = useState<TaskRuleForm[]>(
    [],
  );
  const [editingGroupIndexes, setEditingGroupIndexes] = useState<number[]>([]);
  const [editingGroupDayFrom, setEditingGroupDayFrom] = useState("");
  const [editingGroupDayTo, setEditingGroupDayTo] = useState("");
  const [name, setName] = useState("");
  const [workSchedule, setWorkSchedule] = useState("");
  const [shift, setShift] = useState("");

  const rules = useMemo(
    () => (template?.task_blueprint ?? []).map((item) => toFormRule(item)),
    [template],
  );

  const populateForm = useCallback((item: AdaptationPlanTemplateType) => {
    setName(item.name);
    setWorkSchedule(item.work_schedule);
    const shiftValue = firstShift(item.shifts);
    setShift(shiftValue != null ? String(shiftValue) : "");
  }, []);

  const isFormPopulated = usePopulateEditForm(
    templateId,
    template,
    !isLoading,
    populateForm,
  );

  const workScheduleOptions = useMemo(() => {
    const options = new Set<string>(WORK_SCHEDULE_OPTIONS);
    if (template?.work_schedule) {
      options.add(template.work_schedule);
    }
    if (workSchedule) {
      options.add(workSchedule);
    }
    return [...options];
  }, [template, workSchedule]);

  const groupedRules = useMemo(() => groupTaskRules(rules), [rules]);

  const resetCreateForm = () => {
    setIsCreateVisible(false);
    setCreateRules([{ ...EMPTY_RULE }]);
    setCreateDayFrom("");
    setCreateDayTo("");
  };

  const resetEditGroup = () => {
    setEditingGroupKey(null);
    setEditingGroupRules([]);
    setEditingGroupIndexes([]);
    setEditingGroupDayFrom("");
    setEditingGroupDayTo("");
  };

  const parseShiftNumber = (): number | null => {
    const shiftNumber = Number(shift);
    if (!Number.isInteger(shiftNumber) || shiftNumber < 1) {
      return null;
    }
    return shiftNumber;
  };

  const saveTemplate = async (taskBlueprint: TaskRule[]) => {
    if (!template) {
      return;
    }

    if (!name.trim()) {
      toast.error("Укажите название шаблона");
      return;
    }

    if (!workSchedule) {
      toast.error("Выберите график работы");
      return;
    }

    const shiftNumber = parseShiftNumber();
    if (shiftNumber === null) {
      toast.error("Укажите корректный номер смены");
      return;
    }

    await updateTemplate({
      id: template.id,
      name: name.trim(),
      work_schedule: workSchedule,
      shifts: [shiftNumber],
      task_blueprint: taskBlueprint,
    }).unwrap();
  };

  const saveRules = async (nextRules: TaskRuleForm[]) => {
    const payloadRules = nextRules
      .map(toPayloadRule)
      .filter((rule) => rule.description.length > 0);

    await saveTemplate(payloadRules);
  };

  const handleSaveMetadata = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payloadRules = rules
      .map(toPayloadRule)
      .filter((rule) => rule.description.length > 0);

    try {
      await saveTemplate(payloadRules);
      toast.success("Изменения сохранены");
    } catch {
      toast.error("Не удалось сохранить изменения");
    }
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
      toast.error("Добавьте хотя бы одну задачу с описанием.");
      return;
    }

    if (preparedRules.some((rule) => !rule.responsible_role)) {
      toast.error("Выберите ответственного для каждой задачи.");
      return;
    }

    const normalized = preparedRules.map((rule) => ({
      ...rule,
      day_from: createDayFrom,
      day_to: createDayTo,
    }));

    try {
      await saveRules([...rules, ...normalized]);
      resetCreateForm();
      toast.success("Задачи добавлены");
    } catch {
      toast.error("Не удалось сохранить задачи");
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
      toast.error("Добавьте хотя бы одну задачу с описанием.");
      return;
    }

    if (prepared.some((rule) => !rule.responsible_role)) {
      toast.error("Выберите ответственного для каждой задачи.");
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
      await saveRules(nextRules);
      resetEditGroup();
      toast.success("Изменения сохранены");
    } catch {
      toast.error("Не удалось сохранить изменения");
    }
  };

  const deleteGroup = async (indexes: number[]) => {
    const nextRules = rules.filter(
      (_, currentIndex) => !indexes.includes(currentIndex),
    );

    try {
      await saveRules(nextRules);
      if (editingGroupKey !== null) {
        resetEditGroup();
      }
      toast.success("Группа задач удалена");
    } catch {
      toast.error("Не удалось удалить группу задач");
    }
  };

  if (!templateId) {
    return (
      <ResourceFormPage
        backTo={TEMPLATE_ROUTES.list}
        backLabel="К списку планов адаптации"
        isError
      >
        <></>
      </ResourceFormPage>
    );
  }

  if (isLoading || (template && !isFormPopulated)) {
    return (
      <ResourceFormPage
        backTo={TEMPLATE_ROUTES.list}
        backLabel="К списку планов адаптации"
        isLoading
      >
        <></>
      </ResourceFormPage>
    );
  }

  if (isError || !template) {
    return (
      <ResourceFormPage
        backTo={TEMPLATE_ROUTES.list}
        backLabel="К списку планов адаптации"
        isNoData={!isError}
        isError={isError}
      >
        <></>
      </ResourceFormPage>
    );
  }

  return (
    <ResourceFormPage
      backTo={TEMPLATE_ROUTES.list}
      backLabel="К списку планов адаптации"
    >
      <TemplateMetadataCard
        name={name}
        workSchedule={workSchedule}
        shift={shift}
        workScheduleOptions={workScheduleOptions}
        isSaving={isSaving}
        isDeleting={isDeleting}
        isCreateVisible={isCreateVisible}
        onNameChange={setName}
        onWorkScheduleChange={setWorkSchedule}
        onShiftChange={setShift}
        onSubmit={(event) => {
          void handleSaveMetadata(event);
        }}
        onShowCreate={() => setIsCreateVisible(true)}
        onCancelCreate={resetCreateForm}
        onDelete={() => handleDelete(template.id)}
      />

      {isCreateVisible && (
        <CreateTaskRulesCard
          dayFrom={createDayFrom}
          dayTo={createDayTo}
          rules={createRules}
          isSaving={isSaving}
          onDayFromChange={setCreateDayFrom}
          onDayToChange={setCreateDayTo}
          onAddRule={addCreateRule}
          onUpdateRule={updateCreateRule}
          onRemoveRule={removeCreateRule}
          onSave={() => {
            void saveCreateRules();
          }}
        />
      )}

      <div className="flex flex-col gap-4">
        {groupedRules.map((group) => (
          <TaskRuleGroup
            key={`rule-group-${group.key}`}
            group={group}
            isEditing={editingGroupKey === group.key}
            isSaving={isSaving}
            editingRules={editingGroupRules}
            editingDayFrom={editingGroupDayFrom}
            editingDayTo={editingGroupDayTo}
            onStartEdit={() => startEditGroup(group)}
            onCancelEdit={resetEditGroup}
            onSaveEdit={() => {
              void saveEditGroup();
            }}
            onDeleteGroup={() => {
              void deleteGroup(editingGroupIndexes);
            }}
            onDayFromChange={setEditingGroupDayFrom}
            onDayToChange={setEditingGroupDayTo}
            onAddRule={addEditingGroupRule}
            onUpdateRule={updateEditingGroupRule}
            onRemoveRule={removeEditingGroupRule}
          />
        ))}
      </div>
    </ResourceFormPage>
  );
}

export default TemplateTasks;
