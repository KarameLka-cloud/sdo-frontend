import { FormEvent, JSX, useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useDeleteAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplateByIdQuery,
  useUpdateAdaptationPlanTemplateMutation,
} from "@/services/store/features/adaptation.ts";
import ResourceFormPage from "@/components/resource-list/ResourceFormPage";
import {
  TEMPLATE_ROUTES,
  WORK_SCHEDULE_OPTIONS,
  parseEntityId,
} from "@/components/resource-list/resourceRoutes";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import { usePopulateEditForm } from "@/components/resource-list/usePopulateEditForm";
import { firstShift } from "@/utils/formatShifts.ts";
import { parsePositiveInt } from "@/utils/formValues.ts";
import { AdaptationPlanTemplateType } from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import TaskDayFormDialog from "./TaskDayFormDialog";
import TaskRuleGroup from "./TaskRuleGroup";
import TemplateMetadataCard from "./TemplateMetadataCard";
import {
  GroupedRuleBlock,
  TaskRule,
  TaskRuleForm,
  groupTaskRules,
  prepareDraftRules,
  toFormRule,
  toPayloadRule,
} from "./taskRuleForm";
import { useTaskRuleDraft } from "./useTaskRuleDraft";
import { TEMPLATE_EDITOR_DELETE_MESSAGES } from "@/constants/deleteMessages.ts";

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
    messages: TEMPLATE_EDITOR_DELETE_MESSAGES,
    onSuccess: () => navigate(TEMPLATE_ROUTES.list),
    trackId: false,
  });

  const {
    draft,
    isOpen: isDraftOpen,
    isEdit,
    close: closeDraft,
    startCreate,
    startEdit,
    addRule,
    updateRule,
    removeRule,
    setDayFrom,
    setDayTo,
  } = useTaskRuleDraft();

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

    const shiftNumber = parsePositiveInt(shift);
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

  const saveDraft = async () => {
    if (!draft) {
      return;
    }

    const prepared = prepareDraftRules(draft.rules, draft.dayFrom, draft.dayTo);
    if (!prepared.ok) {
      toast.error(prepared.error);
      return;
    }

    const nextRules =
      draft.mode === "create"
        ? [...rules, ...prepared.rules]
        : [
            ...rules.filter((_, index) => !draft.indexes.includes(index)),
            ...prepared.rules,
          ];

    try {
      await saveRules(nextRules);
      closeDraft();
      toast.success(
        draft.mode === "create" ? "Задачи добавлены" : "Изменения сохранены",
      );
    } catch {
      toast.error(
        draft.mode === "create"
          ? "Не удалось сохранить задачи"
          : "Не удалось сохранить изменения",
      );
    }
  };

  const deleteGroup = async (indexes: number[]) => {
    const nextRules = rules.filter(
      (_, currentIndex) => !indexes.includes(currentIndex),
    );

    try {
      await saveRules(nextRules);
      closeDraft();
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
        onNameChange={setName}
        onWorkScheduleChange={setWorkSchedule}
        onShiftChange={setShift}
        onSubmit={(event) => {
          void handleSaveMetadata(event);
        }}
        onShowCreate={() => {
          closeDraft();
          startCreate();
        }}
        onDelete={() => handleDelete(template.id)}
      />

      <TaskDayFormDialog
        open={isDraftOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDraft();
          }
        }}
        isEdit={isEdit}
        dayFrom={draft?.dayFrom ?? ""}
        dayTo={draft?.dayTo ?? ""}
        rules={draft?.rules ?? []}
        isSaving={isSaving}
        onDayFromChange={setDayFrom}
        onDayToChange={setDayTo}
        onAddRule={addRule}
        onUpdateRule={updateRule}
        onRemoveRule={removeRule}
        onSave={() => {
          void saveDraft();
        }}
        onDelete={
          isEdit && draft
            ? () => {
                void deleteGroup(draft.indexes);
              }
            : undefined
        }
      />

      <div className="flex flex-col gap-4">
        {groupedRules.map((group) => (
          <TaskRuleGroup
            key={`rule-group-${group.key}`}
            group={group}
            onStartEdit={() => {
              closeDraft();
              startEdit(group);
            }}
          />
        ))}
      </div>
    </ResourceFormPage>
  );
}

export default TemplateTasks;
