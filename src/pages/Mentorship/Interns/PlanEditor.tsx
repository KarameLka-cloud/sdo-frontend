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
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Separator } from "@/components/ui/shadcn/separator";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { cn } from "@/lib/utils";
import { formatDayRange } from "@/utils/formatDayRange.ts";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import AdminEditFormFooter from "@/pages/Admin/shared/components/AdminEditFormFooter";
import {
  INTERNSHIP_ROUTES,
  parseEntityId,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";

interface PlanType {
  id: number;
  user_id: number;
  start_date: string;
  adaptation_plan_template_id?: number | null;
  shift: number;
  mentor: number;
  department_head: number;
  user?: { name?: string };
  template?: {
    id: number;
    name: string;
    work_schedule: string;
    shifts: number[];
  };
  days?: Array<{
    id: number;
    work_day: number;
    day_from?: number | null;
    day_to?: number | null;
    date_from: string;
    date_to?: string | null;
    completion: "в процессе" | "выполнен" | "есть замечания";
    employee_comment?: string | null;
    intern_comment?: string | null;
    mentor_comment?: string | null;
    department_head_comment?: string | null;
    tasks?: Array<{
      id: number;
      description: string;
      status: "выполнено" | "не выполнено";
    }>;
  }>;
}

const DELETE_MESSAGES = {
  confirm: "Удалить план стажера?",
  success: "План стажера удалён",
  error: "Не удалось удалить план",
};

type EditableCommentKey =
  | "employee_comment"
  | "mentor_comment"
  | "department_head_comment";

interface CommentFieldWithSaveProps {
  label: string;
  value: string;
  savedValue: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}

function CommentFieldWithSave({
  label,
  value,
  savedValue,
  isSaving,
  onChange,
  onSave,
}: CommentFieldWithSaveProps): JSX.Element {
  const hasChanges = value !== savedValue;

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button
        type="button"
        size="sm"
        className="w-fit"
        disabled={!hasChanges || isSaving}
        onClick={onSave}
      >
        {isSaving && <Spinner />}
        Сохранить
      </Button>
    </Field>
  );
}

function ReadonlyCommentBlock({ text }: { text: string }): JSX.Element {
  const trimmed = (text ?? "").trim();
  return (
    <div
      className={cn(
        "m-0 min-h-[1.35em] text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
        !trimmed && "text-muted-foreground",
      )}
    >
      {trimmed || "—"}
    </div>
  );
}

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
  const { handleDelete, isDeleting } = useAdminEditDelete(
    deleteMutation,
    DELETE_MESSAGES,
    () => navigate(INTERNSHIP_ROUTES.list),
  );

  const { role, role_name: roleName } = useUser();
  const plan = data as PlanType | undefined;
  const mentors = mentorsData as UserType[];
  const heads = headsData as UserType[];

  const [form, setForm] = useState({
    startDate: "",
    templateId: null as number | null,
    shift: 1,
    mentor: null as number | null,
    departmentHead: null as number | null,
  });
  const [days, setDays] = useState<
    Array<{
      id: number;
      work_day: number;
      day_from?: number | null;
      day_to?: number | null;
      date_from: string;
      date_to?: string | null;
      completion: "в процессе" | "выполнен" | "есть замечания";
      employee_comment: string;
      intern_comment: string;
      mentor_comment: string;
      department_head_comment: string;
      tasks: Array<{
        id: number;
        description: string;
        status: "выполнено" | "не выполнено";
      }>;
    }>
  >([]);
  const [initialDays, setInitialDays] = useState<typeof days>([]);
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

    const mappedDays = (plan.days ?? []).map((day) => ({
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

      const dayRequests = days.map((day, dayIndex) => {
        const initial = initialDays[dayIndex];
        const employee_comment = commentPermissions.canEditEmployee
          ? day.employee_comment
          : (initial?.employee_comment ?? "");
        const mentor_comment = commentPermissions.canEditMentor
          ? day.mentor_comment
          : (initial?.mentor_comment ?? "");
        const department_head_comment = commentPermissions.canEditDepartmentHead
          ? day.department_head_comment
          : (initial?.department_head_comment ?? "");

        return updateDay({
          planId: plan.id,
          dayId: day.id,
          date_from: day.date_from,
          date_to: day.date_to || null,
          completion: day.completion,
          employee_comment: employee_comment || null,
          intern_comment: day.intern_comment || null,
          mentor_comment: mentor_comment || null,
          department_head_comment: department_head_comment || null,
        }).unwrap();
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
      <AdminFormPage
        backTo={INTERNSHIP_ROUTES.list}
        backLabel="К списку стажеров"
        isError
      >
        <></>
      </AdminFormPage>
    );
  }

  if (isLoading) {
    return (
      <AdminFormPage
        backTo={INTERNSHIP_ROUTES.list}
        backLabel="К списку стажеров"
        isLoading
      >
        <></>
      </AdminFormPage>
    );
  }

  if (isError || !plan) {
    return (
      <AdminFormPage
        backTo={INTERNSHIP_ROUTES.list}
        backLabel="К списку стажеров"
        isError
      >
        {loadErrorMessage && (
          <p className="text-sm text-muted-foreground">{loadErrorMessage}</p>
        )}
      </AdminFormPage>
    );
  }

  return (
    <AdminFormPage
      backTo={INTERNSHIP_ROUTES.list}
      backLabel="К списку стажеров"
    >
      <Card>
        <CardHeader>
          <CardTitle>Редактирование плана адаптации</CardTitle>
        </CardHeader>
        <form onSubmit={handleSaveAll}>
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="plan-intern">Стажер</FieldLabel>
                <Input
                  id="plan-intern"
                  value={plan.user?.name ?? `Пользователь ID: ${plan.user_id}`}
                  readOnly
                  disabled
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-start-date">
                  Дата начала стажировки
                </FieldLabel>
                <Input
                  id="plan-start-date"
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm({ ...form, startDate: event.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-schedule">Режим работы</FieldLabel>
                <Input
                  id="plan-schedule"
                  value={plan.template?.work_schedule ?? "—"}
                  readOnly
                  disabled
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-template">
                  Шаблон адаптации
                </FieldLabel>
                <Input
                  id="plan-template"
                  value={
                    plan.template
                      ? `${plan.template.name} (смена: ${form.shift})`
                      : "—"
                  }
                  readOnly
                  disabled
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-mentor">Наставник</FieldLabel>
                <Select
                  value={form.mentor ? String(form.mentor) : ""}
                  onValueChange={(value) =>
                    setForm({ ...form, mentor: Number(value) })
                  }
                >
                  <SelectTrigger id="plan-mentor" className="w-full">
                    <SelectValue placeholder="Выберите наставника" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={String(mentor.id)}>
                        {mentor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-head">Руководитель отдела</FieldLabel>
                <Select
                  value={form.departmentHead ? String(form.departmentHead) : ""}
                  onValueChange={(value) =>
                    setForm({ ...form, departmentHead: Number(value) })
                  }
                >
                  <SelectTrigger id="plan-head" className="w-full">
                    <SelectValue placeholder="Выберите руководителя" />
                  </SelectTrigger>
                  <SelectContent>
                    {heads.map((head) => (
                      <SelectItem key={head.id} value={String(head.id)}>
                        {head.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </CardContent>
          <Separator />
          <AdminEditFormFooter
            isSaving={isSavingPlan}
            isDeleting={isDeleting}
            onDelete={() => handleDelete(plan.id)}
          />
        </form>
      </Card>

      <div className="flex flex-col gap-4">
        {days.map((day, dayIndex) => (
          <Card key={day.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {formatDayRange(day.day_from, day.day_to, day.work_day, "День")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={`day-date-from-${day.id}`}>
                    Дата от
                  </FieldLabel>
                  <Input
                    id={`day-date-from-${day.id}`}
                    type="date"
                    value={day.date_from}
                    onChange={(event) =>
                      setDays((previous) => {
                        const next = [...previous];
                        next[dayIndex] = {
                          ...next[dayIndex],
                          date_from: event.target.value,
                        };
                        return next;
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`day-date-to-${day.id}`}>
                    Дата до (опционально)
                  </FieldLabel>
                  <Input
                    id={`day-date-to-${day.id}`}
                    type="date"
                    value={day.date_to ?? ""}
                    onChange={(event) =>
                      setDays((previous) => {
                        const next = [...previous];
                        next[dayIndex] = {
                          ...next[dayIndex],
                          date_to: event.target.value || null,
                        };
                        return next;
                      })
                    }
                  />
                </Field>
              </FieldGroup>
              <Field>
                <FieldLabel htmlFor={`day-status-${day.id}`}>
                  Статус дня
                </FieldLabel>
                <Select
                  value={day.completion}
                  onValueChange={(value) =>
                    setDays((previous) => {
                      const next = [...previous];
                      next[dayIndex] = {
                        ...next[dayIndex],
                        completion: value as
                          | "в процессе"
                          | "выполнен"
                          | "есть замечания",
                      };
                      return next;
                    })
                  }
                >
                  <SelectTrigger id={`day-status-${day.id}`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="в процессе">В процессе</SelectItem>
                    <SelectItem value="выполнен">Выполнен</SelectItem>
                    <SelectItem value="есть замечания">
                      Есть замечания
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {commentPermissions.canEditEmployee ? (
                <CommentFieldWithSave
                  label="Комментарий УПиПК"
                  value={day.employee_comment}
                  savedValue={initialDays[dayIndex]?.employee_comment ?? ""}
                  isSaving={savingCommentKey === `${day.id}-employee_comment`}
                  onChange={(value) =>
                    setDays((previous) => {
                      const next = [...previous];
                      next[dayIndex] = {
                        ...next[dayIndex],
                        employee_comment: value,
                      };
                      return next;
                    })
                  }
                  onSave={() =>
                    void handleSaveComment(dayIndex, "employee_comment")
                  }
                />
              ) : (
                <Field>
                  <FieldLabel>Комментарий УПиПК</FieldLabel>
                  <ReadonlyCommentBlock text={day.employee_comment} />
                </Field>
              )}
              <Field>
                <FieldLabel>Комментарий стажера</FieldLabel>
                <ReadonlyCommentBlock text={day.intern_comment} />
              </Field>
              {commentPermissions.canEditMentor ? (
                <CommentFieldWithSave
                  label="Комментарий наставника"
                  value={day.mentor_comment}
                  savedValue={initialDays[dayIndex]?.mentor_comment ?? ""}
                  isSaving={savingCommentKey === `${day.id}-mentor_comment`}
                  onChange={(value) =>
                    setDays((previous) => {
                      const next = [...previous];
                      next[dayIndex] = {
                        ...next[dayIndex],
                        mentor_comment: value,
                      };
                      return next;
                    })
                  }
                  onSave={() =>
                    void handleSaveComment(dayIndex, "mentor_comment")
                  }
                />
              ) : (
                <Field>
                  <FieldLabel>Комментарий наставника</FieldLabel>
                  <ReadonlyCommentBlock text={day.mentor_comment} />
                </Field>
              )}
              {commentPermissions.canEditDepartmentHead ? (
                <CommentFieldWithSave
                  label="Комментарий руководителя"
                  value={day.department_head_comment}
                  savedValue={
                    initialDays[dayIndex]?.department_head_comment ?? ""
                  }
                  isSaving={
                    savingCommentKey === `${day.id}-department_head_comment`
                  }
                  onChange={(value) =>
                    setDays((previous) => {
                      const next = [...previous];
                      next[dayIndex] = {
                        ...next[dayIndex],
                        department_head_comment: value,
                      };
                      return next;
                    })
                  }
                  onSave={() =>
                    void handleSaveComment(dayIndex, "department_head_comment")
                  }
                />
              ) : (
                <Field>
                  <FieldLabel>Комментарий руководителя</FieldLabel>
                  <ReadonlyCommentBlock text={day.department_head_comment} />
                </Field>
              )}

              <div className="flex flex-col gap-3">
                {day.tasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    className="grid grid-cols-[1fr_11rem] items-center gap-3 max-sm:grid-cols-1"
                  >
                    <span className="text-sm">{task.description}</span>
                    <Select
                      value={task.status}
                      onValueChange={(value) =>
                        setDays((previous) => {
                          const next = [...previous];
                          const tasks = [...next[dayIndex].tasks];
                          tasks[taskIndex] = {
                            ...tasks[taskIndex],
                            status: value as "выполнено" | "не выполнено",
                          };
                          next[dayIndex] = { ...next[dayIndex], tasks };
                          return next;
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="не выполнено">
                          Не выполнено
                        </SelectItem>
                        <SelectItem value="выполнено">Выполнено</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminFormPage>
  );
}

export default PlanEditor;
