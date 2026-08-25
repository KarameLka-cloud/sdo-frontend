import { FormEvent, JSX, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useDeleteAdaptationPlanMutation,
  useGetAdaptationPlanByIdQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useUpdateAdaptationPlanDayMutation,
  useUpdateAdaptationPlanMutation,
  useUpdateAdaptationPlanTaskStatusMutation,
} from "@/services/store/features/user.ts";
import { UserType } from "@/interfaces/api/UserType.ts";
import { USER_ROLES, hasRole } from "@/constants/roles.ts";
import { useUser } from "@/hooks/useUser.ts";
import ResourceFormPage from "@/components/resource-list/ResourceFormPage";
import {
  INTERNSHIP_ROUTES,
  parseEntityId,
} from "@/components/resource-list/resourceRoutes";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import PlanDayCard from "@/pages/Mentorship/Interns/plan-editor/PlanDayCard";
import PlanMetaForm from "@/pages/Mentorship/Interns/plan-editor/PlanMetaForm";
import {
  getEffectiveDayFields,
  isDayDirty,
} from "@/pages/Mentorship/Interns/plan-editor/isDayDirty";
import type {
  EditableCommentKey,
  EditablePlanDay,
} from "@/pages/Mentorship/Interns/plan-editor/types.ts";

const DELETE_MESSAGES = {
  confirm: "Удалить план стажера?",
  success: "План стажера удалён",
  error: "Не удалось удалить план",
};

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

  const [updatePlan, { isLoading: isSavingPlan }] =
    useUpdateAdaptationPlanMutation();
  const [updateDay] = useUpdateAdaptationPlanDayMutation();
  const [updateTask] = useUpdateAdaptationPlanTaskStatusMutation();
  const deleteMutation = useDeleteAdaptationPlanMutation();
  const { handleDelete, isDeleting } = useConfirmDelete(deleteMutation, {
    messages: DELETE_MESSAGES,
    onSuccess: () => navigate(INTERNSHIP_ROUTES.list),
    trackId: false,
  });

  const { role, role_name: roleName } = useUser();
  const plan = data;
  const mentors = mentorsData as UserType[];
  const heads = headsData as UserType[];

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

  const loadErrorMessage = useMemo(() => {
    if (!error || typeof error !== "object" || !("status" in error)) {
      return "";
    }

    if (error.status === 403) {
      return "Недостаточно прав для просмотра или редактирования этого плана.";
    }

    if (
      "data" in error &&
      typeof error.data === "object" &&
      error.data !== null
    ) {
      const message = (error.data as { message?: string }).message;
      if (message) {
        return message;
      }
    }

    return "Не удалось загрузить план.";
  }, [error]);

  useEffect(() => {
    if (!plan) {
      return;
    }

    setForm({
      startDate: plan.start_date ?? "",
      templateId: plan.adaptation_plan_template_id ?? plan.template?.id ?? null,
      shift: plan.shift ?? 1,
      mentor: plan.mentor ?? null,
      departmentHead: plan.department_head ?? null,
    });

    const mappedDays: EditablePlanDay[] = (plan.days ?? []).map((day) => ({
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
      })),
    }));

    setDays(mappedDays);
    setInitialDays(mappedDays);
  }, [plan]);

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
      canEditDepartmentHead: !isAdmin && isDepartmentHead,
      canEditMentor: !isAdmin && !isDepartmentHead && isMentor,
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
        intern_comment: day.intern_comment || null,
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

  const handleSaveAll = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!plan) {
      return;
    }
    if (
      !form.templateId ||
      !form.mentor ||
      !form.departmentHead ||
      !form.startDate
    ) {
      toast.error("Заполните все обязательные поля.");
      return;
    }

    try {
      await updatePlan({
        id: plan.id,
        start_date: form.startDate,
        adaptation_plan_template_id: form.templateId,
        shift: form.shift,
        mentor: form.mentor,
        department_head: form.departmentHead,
      }).unwrap();

      const dayRequests = days.flatMap((day, dayIndex) => {
        const initial = initialDays[dayIndex];
        if (!isDayDirty(day, initial, commentPermissions)) {
          return [];
        }

        const fields = getEffectiveDayFields(day, initial, commentPermissions);
        return [
          updateDay({
            planId: plan.id,
            dayId: day.id,
            date_from: fields.date_from,
            date_to: fields.date_to,
            completion: fields.completion,
            employee_comment: fields.employee_comment || null,
            intern_comment: fields.intern_comment || null,
            mentor_comment: fields.mentor_comment || null,
            department_head_comment: fields.department_head_comment || null,
          }).unwrap(),
        ];
      });

      const taskRequests: Array<Promise<unknown>> = [];
      days.forEach((day, dayIndex) => {
        day.tasks.forEach((task, taskIndex) => {
          const initialTask = initialDays[dayIndex]?.tasks?.[taskIndex];
          if (!initialTask || initialTask.status !== task.status) {
            taskRequests.push(
              updateTask({
                planId: plan.id,
                dayId: day.id,
                taskId: task.id,
                status: task.status,
              }).unwrap(),
            );
          }
        });
      });

      await Promise.all([...dayRequests, ...taskRequests]);
      setInitialDays(days);
      toast.success("План сохранён");
    } catch {
      toast.error("Не удалось сохранить план");
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
            onDayChange={(patch) =>
              setDays((previous) => {
                const next = [...previous];
                next[dayIndex] = { ...next[dayIndex], ...patch };
                return next;
              })
            }
            onTaskStatusChange={(taskIndex, status) =>
              setDays((previous) => {
                const next = [...previous];
                const tasks = [...next[dayIndex].tasks];
                tasks[taskIndex] = { ...tasks[taskIndex], status };
                next[dayIndex] = { ...next[dayIndex], tasks };
                return next;
              })
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
