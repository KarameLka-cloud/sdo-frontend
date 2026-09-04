import { FormEvent, JSX, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useDeleteAdaptationPlanMutation,
  useGetAdaptationPlanByIdQuery,
  useUpdateAdaptationPlanDayMutation,
  useUpdateAdaptationPlanMutation,
  useUpdateAdaptationPlanTaskStatusMutation,
} from "@/services/store/features/adaptation.ts";
import {
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
} from "@/services/store/features/users.ts";
import { USER_ROLES, hasRole } from "@/constants/roles.ts";
import { useUser } from "@/hooks/useUser.ts";
import ResourceFormPage from "@/components/resource-list/ResourceFormPage";
import {
  INTERNSHIP_ROUTES,
  parseEntityId,
} from "@/components/resource-list/resourceRoutes";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import PlanDayCard from "@/pages/Mentorship/Interns/plan-editor/PlanDayCard";
import PlanMetaForm, {
  resolvePlanMetaForm,
} from "@/pages/Mentorship/Interns/plan-editor/PlanMetaForm";
import { getEffectiveDayFields } from "@/pages/Mentorship/Interns/plan-editor/dayFormFields";
import type {
  CommentFieldKey,
  EditableCommentKey,
  EditablePlanDay,
} from "@/pages/Mentorship/Interns/plan-editor/types.ts";
import type { TaskStatus } from "@/interfaces/api/AdaptationPlanType.ts";
import { PLAN_DELETE_MESSAGES } from "@/constants/deleteMessages.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import { toDateInputValue } from "@/utils/formValues.ts";
import { compareDayRanges } from "@/utils/formatDayRange.ts";
import { resolveRoleUsers } from "@/utils/resolveRoleUsers.ts";
import { getApiErrorMessage, getApiErrorStatus } from "@/utils/apiError.ts";
import { withAssignedUser } from "@/utils/userSelectOptions.ts";

function PlanEditor(): JSX.Element {
  const navigate = useNavigate();
  const { planId } = useParams();
  const numericPlanId = parseEntityId(planId) ?? 0;

  const { data, isLoading, isError, error } = useGetAdaptationPlanByIdQuery(
    numericPlanId,
    {
      skip: !numericPlanId,
    },
  );
  const { data: mentorsData = [] } = useGetMentorsQuery(undefined);
  const { data: headsData = [] } = useGetDepartmentHeadsQuery(undefined);
  const { data: usersData = [] } = useGetUsersQuery(undefined);

  const [updatePlan, { isLoading: isSavingPlan }] =
    useUpdateAdaptationPlanMutation();
  const [updateDay] = useUpdateAdaptationPlanDayMutation();
  const [updateTask] = useUpdateAdaptationPlanTaskStatusMutation();
  const deleteMutation = useDeleteAdaptationPlanMutation();
  const { handleDelete, isDeleting } = useConfirmDelete(deleteMutation, {
    messages: PLAN_DELETE_MESSAGES,
    onSuccess: () => navigate(INTERNSHIP_ROUTES.list),
    trackId: false,
  });

  const { role, role_name: roleName } = useUser();
  const plan = data;

  const mentors = useMemo(
    () =>
      withAssignedUser(
        resolveRoleUsers(mentorsData, usersData, USER_ROLES.MENTOR),
        plan?.mentor_user,
        plan?.mentor,
      ),
    [mentorsData, usersData, plan?.mentor, plan?.mentor_user],
  );
  const heads = useMemo(
    () =>
      withAssignedUser(
        resolveRoleUsers(headsData, usersData, USER_ROLES.DEPARTMENT_HEAD),
        plan?.department_head_user,
        plan?.department_head,
      ),
    [headsData, usersData, plan?.department_head, plan?.department_head_user],
  );

  const [form, setForm] = useState({
    startDate: "",
    templateId: null as number | null,
    shift: 1,
    mentor: null as number | null,
    departmentHead: null as number | null,
  });
  const [days, setDays] = useState<EditablePlanDay[]>([]);
  const [initialDays, setInitialDays] = useState<EditablePlanDay[]>([]);
  const [savingCommentKey, setSavingCommentKey] = useState<string | null>(null);
  const [savingTaskKey, setSavingTaskKey] = useState<string | null>(null);
  const [savingDayId, setSavingDayId] = useState<number | null>(null);

  const loadErrorMessage = useMemo(() => {
    if (!error) {
      return "";
    }

    if (getApiErrorStatus(error) === 403) {
      return "Недостаточно прав для просмотра или редактирования этого плана.";
    }

    return getApiErrorMessage(error) ?? "Не удалось загрузить план.";
  }, [error]);

  // Saving a comment refetches the plan. Seeding the form on every refetch
  // would throw away edits the user has not saved yet, so the form is filled
  // once per plan and stays the source of truth afterwards.
  const seededPlanId = useRef<number | null>(null);

  useEffect(() => {
    seededPlanId.current = null;
  }, [numericPlanId]);

  useEffect(() => {
    if (!plan || plan.id !== numericPlanId) {
      return;
    }
    if (seededPlanId.current === plan.id) {
      return;
    }
    seededPlanId.current = plan.id;

    setForm({
      startDate: toDateInputValue(plan.start_date),
      templateId: plan.adaptation_plan_template_id ?? plan.template?.id ?? null,
      shift: plan.shift ?? 1,
      mentor: plan.mentor ?? plan.mentor_user?.id ?? null,
      departmentHead: plan.department_head ?? plan.department_head_user?.id ?? null,
    });

    const mappedDays: EditablePlanDay[] = (plan.days ?? [])
      .map((day) => ({
        id: day.id,
        work_day: day.work_day,
        day_from: day.day_from ?? null,
        day_to: day.day_to ?? null,
        date_from: day.date_from,
        date_to: day.date_to ?? null,
        completion: day.completion,
        employee_comment: day.employee_comment ?? "",
        intern_comment: day.intern_comment ?? "",
        mentor_comment: day.mentor_comment ?? "",
        department_head_comment: day.department_head_comment ?? "",
        tasks: (day.tasks ?? []).map((task) => ({
          id: task.id,
          description: task.description,
          status: task.status,
          responsible_role: task.responsible_role,
          links: task.links,
        })),
      }))
      .sort((left, right) =>
        compareDayRanges(
          left.day_from ?? left.work_day,
          left.day_to,
          right.day_from ?? right.work_day,
          right.day_to,
        ),
      );

    setDays(mappedDays);
    setInitialDays(mappedDays);
  }, [plan, numericPlanId]);

  const commentPermissions = useMemo(() => {
    const isAdmin = hasRole(role, roleName, USER_ROLES.ADMIN);
    const isDepartmentHead = hasRole(
      role,
      roleName,
      USER_ROLES.DEPARTMENT_HEAD,
    );
    const isMentor = hasRole(role, roleName, USER_ROLES.MENTOR);

    return {
      canEditEmployee: isAdmin,
      // Interns edit this on /adaptation; staff on this page never can.
      canEditIntern: false,
      canEditMentor: !isAdmin && !isDepartmentHead && isMentor,
      canEditDepartmentHead: !isAdmin && isDepartmentHead,
    };
  }, [role, roleName]);

  const handleSaveComment = async (
    dayIndex: number,
    commentKey: EditableCommentKey,
  ) => {
    if (!plan) {
      return;
    }

    const day = days[dayIndex];
    const initial = initialDays[dayIndex];
    const saveKey = `${day.id}-${commentKey}`;

    setSavingCommentKey(saveKey);
    try {
      await updateDay({
        planId: plan.id,
        dayId: day.id,
        date_from: day.date_from,
        date_to: day.date_to || null,
        completion: day.completion,
        employee_comment:
          commentKey === "employee_comment"
            ? day.employee_comment || null
            : initial?.employee_comment || null,
        intern_comment: initial?.intern_comment || null,
        mentor_comment:
          commentKey === "mentor_comment"
            ? day.mentor_comment || null
            : initial?.mentor_comment || null,
        department_head_comment:
          commentKey === "department_head_comment"
            ? day.department_head_comment || null
            : initial?.department_head_comment || null,
      }).unwrap();

      setInitialDays((previous) => {
        const next = [...previous];
        next[dayIndex] = { ...next[dayIndex], [commentKey]: day[commentKey] };
        return next;
      });
      toast.success("Комментарий сохранён");
    } catch {
      toast.error("Не удалось сохранить комментарий");
    } finally {
      setSavingCommentKey(null);
    }
  };

  const handleDayFieldChange = async (
    dayIndex: number,
    patch: Partial<Pick<EditablePlanDay, "date_from" | "date_to" | "completion">>,
  ) => {
    if (!plan) {
      return;
    }

    const previousDay = days[dayIndex];
    const nextDay = { ...previousDay, ...patch };
    const initial = initialDays[dayIndex];

    setDays((previous) => {
      const next = [...previous];
      next[dayIndex] = nextDay;
      return next;
    });

    setSavingDayId(nextDay.id);
    try {
      const fields = getEffectiveDayFields(nextDay, initial, commentPermissions);
      await updateDay({
        planId: plan.id,
        dayId: nextDay.id,
        date_from: fields.date_from,
        date_to: fields.date_to,
        completion: fields.completion,
        employee_comment: fields.employee_comment || null,
        intern_comment: fields.intern_comment || null,
        mentor_comment: fields.mentor_comment || null,
        department_head_comment: fields.department_head_comment || null,
      }).unwrap();

      setInitialDays((previous) => {
        const next = [...previous];
        next[dayIndex] = {
          ...next[dayIndex],
          date_from: nextDay.date_from,
          date_to: nextDay.date_to,
          completion: nextDay.completion,
        };
        return next;
      });
      toast.success(FORM_STATUS_MESSAGES.saveSuccess);
    } catch {
      setDays((previous) => {
        const next = [...previous];
        next[dayIndex] = previousDay;
        return next;
      });
      toast.error(FORM_STATUS_MESSAGES.saveError);
    } finally {
      setSavingDayId(null);
    }
  };

  const handleTaskStatusChange = async (
    dayIndex: number,
    taskIndex: number,
    status: TaskStatus,
  ) => {
    if (!plan) {
      return;
    }

    const previousDay = days[dayIndex];
    const previousTask = previousDay.tasks[taskIndex];
    if (previousTask.status === status) {
      return;
    }

    const nextTasks = [...previousDay.tasks];
    nextTasks[taskIndex] = { ...nextTasks[taskIndex], status };
    const nextDay = { ...previousDay, tasks: nextTasks };

    setDays((previous) => {
      const next = [...previous];
      next[dayIndex] = nextDay;
      return next;
    });

    const saveKey = `${previousDay.id}-${previousTask.id}`;
    setSavingTaskKey(saveKey);
    try {
      await updateTask({
        planId: plan.id,
        dayId: previousDay.id,
        taskId: previousTask.id,
        status,
      }).unwrap();

      setInitialDays((previous) => {
        const next = [...previous];
        const tasks = [...next[dayIndex].tasks];
        tasks[taskIndex] = { ...tasks[taskIndex], status };
        next[dayIndex] = { ...next[dayIndex], tasks };
        return next;
      });
      toast.success(FORM_STATUS_MESSAGES.saveSuccess);
    } catch {
      setDays((previous) => {
        const next = [...previous];
        next[dayIndex] = previousDay;
        return next;
      });
      toast.error(FORM_STATUS_MESSAGES.saveError);
    } finally {
      setSavingTaskKey(null);
    }
  };

  const handleCommentChange = (
    dayIndex: number,
    commentKey: CommentFieldKey,
    value: string,
  ) => {
    setDays((previous) => {
      const next = [...previous];
      next[dayIndex] = { ...next[dayIndex], [commentKey]: value };
      return next;
    });
  };

  const handleSaveAll = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!plan) {
      return;
    }
    const meta = resolvePlanMetaForm(form, plan);
    if (!meta.startDate || meta.mentor == null || meta.departmentHead == null) {
      toast.error("Заполните все обязательные поля.");
      return;
    }

    try {
      await updatePlan({
        id: plan.id,
        start_date: meta.startDate,
        ...(meta.templateId
          ? { adaptation_plan_template_id: meta.templateId }
          : {}),
        shift: meta.shift,
        mentor: meta.mentor,
        department_head: meta.departmentHead,
      }).unwrap();
      toast.success("Параметры плана сохранены");
    } catch {
      toast.error("Не удалось сохранить параметры плана.");
    }
  };

  if (!numericPlanId) {
    return (
      <ResourceFormPage
        backTo={INTERNSHIP_ROUTES.list}
        backLabel="К списку стажеров"
        isError
      >
        <></>
      </ResourceFormPage>
    );
  }

  if (isLoading) {
    return (
      <ResourceFormPage
        backTo={INTERNSHIP_ROUTES.list}
        backLabel="К списку стажеров"
        isLoading
      >
        <></>
      </ResourceFormPage>
    );
  }

  if (isError || !plan) {
    return (
      <ResourceFormPage
        backTo={INTERNSHIP_ROUTES.list}
        backLabel="К списку стажеров"
        isError
      >
        {loadErrorMessage && (
          <p className="text-sm text-muted-foreground">{loadErrorMessage}</p>
        )}
      </ResourceFormPage>
    );
  }

  return (
    <ResourceFormPage
      backTo={INTERNSHIP_ROUTES.list}
      backLabel="К списку стажеров"
    >
      <PlanMetaForm
        internLabel={plan.user?.name ?? `Пользователь ID: ${plan.user_id}`}
        workSchedule={plan.template?.work_schedule ?? "—"}
        templateName={plan.template?.name ?? null}
        form={form}
        mentors={mentors}
        heads={heads}
        isSaving={isSavingPlan}
        isDeleting={isDeleting}
        onFormChange={(next) => setForm((previous) => ({ ...previous, ...next }))}
        onSubmit={handleSaveAll}
        onDelete={() => handleDelete(plan.id)}
      />

      <div className="flex flex-col gap-4">
        {days.map((day, dayIndex) => (
          <PlanDayCard
            key={day.id}
            day={day}
            initialDay={initialDays[dayIndex]}
            commentPermissions={commentPermissions}
            savingCommentKey={savingCommentKey}
            savingTaskKey={savingTaskKey}
            isSavingDayFields={savingDayId === day.id}
            onDayFieldChange={(patch) => void handleDayFieldChange(dayIndex, patch)}
            onCommentChange={(commentKey, value) =>
              handleCommentChange(dayIndex, commentKey, value)
            }
            onTaskStatusChange={(taskIndex, status) =>
              void handleTaskStatusChange(dayIndex, taskIndex, status)
            }
            onSaveComment={(commentKey) =>
              void handleSaveComment(dayIndex, commentKey)
            }
          />
        ))}
      </div>
    </ResourceFormPage>
  );
}

export default PlanEditor;
