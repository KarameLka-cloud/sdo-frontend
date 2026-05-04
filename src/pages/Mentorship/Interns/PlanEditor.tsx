import { JSX, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import Input from "@components/ui/Input/Input.tsx";
import Loader from "@components/ui/Loader/Loader.tsx";
import {
  useDeleteAdaptationPlanMutation,
  useGetAdaptationPlanByIdQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useUpdateAdaptationPlanDayMutation,
  useUpdateAdaptationPlanMutation,
  useUpdateAdaptationPlanTaskStatusMutation,
} from "@services/store/features/user.ts";
import { UserType } from "@interfaces/api/UserType.ts";
import { ROUTES } from "@constants/routes.ts";
import { FORM_STATUS_MESSAGES } from "@constants/formStatus.ts";
import { USER_ROLES, hasRole } from "@constants/roles.ts";
import { useUser } from "@hooks/useUser.ts";
import styles from "./PlanEditor.module.css";

interface PlanType {
  id: number;
  user_id: number;
  start_date: string;
  adaptation_plan_template_id?: number | null;
  shift: number;
  mentor: number;
  department_head: number;
  user?: { name?: string };
  template?: { id: number; name: string; work_schedule: string; shifts: number[] };
  days?: Array<{
    id: number;
    work_day: number;
    date: string;
    completion: "в процессе" | "выполнен" | "есть замечания";
    employee_comment?: string | null;
    intern_comment?: string | null;
    mentor_comment?: string | null;
    department_head_comment?: string | null;
    tasks?: Array<{ id: number; description: string; status: "выполнено" | "не выполнено" }>;
  }>;
}

type StatusType = "idle" | "loading" | "success" | "error";

function ReadonlyCommentBlock({ text }: { text: string }): JSX.Element {
  const trimmed = (text ?? "").trim();
  return (
    <div
      className={`${styles.commentText} ${!trimmed ? styles.commentTextPlaceholder : ""}`}
    >
      {trimmed || "—"}
    </div>
  );
}

function PlanEditor(): JSX.Element {
  const navigate = useNavigate();
  const { planId } = useParams();
  const numericPlanId = Number(planId);

  const { data, isLoading, isError, error } = useGetAdaptationPlanByIdQuery(numericPlanId, {
    skip: !numericPlanId,
  });
  const { data: mentorsData = [] } = useGetMentorsQuery(undefined);
  const { data: headsData = [] } = useGetDepartmentHeadsQuery(undefined);

  const [updatePlan, { isLoading: isSavingPlan }] = useUpdateAdaptationPlanMutation();
  const [updateDay] = useUpdateAdaptationPlanDayMutation();
  const [updateTask] = useUpdateAdaptationPlanTaskStatusMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeleteAdaptationPlanMutation();

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
      date: string;
      completion: "в процессе" | "выполнен" | "есть замечания";
      employee_comment: string;
      intern_comment: string;
      mentor_comment: string;
      department_head_comment: string;
      tasks: Array<{ id: number; description: string; status: "выполнено" | "не выполнено" }>;
    }>
  >([]);
  const [initialDays, setInitialDays] = useState<typeof days>([]);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("idle");

  const loadErrorMessage = useMemo(() => {
    if (!error || typeof error !== "object" || !("status" in error)) {
      return "";
    }

    if (error.status === 403) {
      return "Недостаточно прав для просмотра или редактирования этого плана.";
    }

    if ("data" in error && typeof error.data === "object" && error.data !== null) {
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
      date: day.date,
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
    const isDepartmentHead = hasRole(role, roleName, USER_ROLES.DEPARTMENT_HEAD);
    const isMentor = hasRole(role, roleName, USER_ROLES.MENTOR);

    return {
      canEditEmployee: isAdmin,
      canEditDepartmentHead: !isAdmin && isDepartmentHead,
      canEditMentor: !isAdmin && !isDepartmentHead && isMentor,
    };
  }, [role, roleName]);

  const handleSaveAll = async () => {
    if (!plan) {
      return;
    }
    if (!form.templateId || !form.mentor || !form.departmentHead || !form.startDate) {
      setStatusType("error");
      setStatus("Заполните все обязательные поля.");
      return;
    }

    try {
      setStatusType("loading");
      setStatus(FORM_STATUS_MESSAGES.saveLoading);
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
          date: day.date,
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
      setStatusType("success");
      setStatus(FORM_STATUS_MESSAGES.saveSuccess);
    } catch {
      setStatusType("error");
      setStatus(FORM_STATUS_MESSAGES.saveError);
    }
  };

  const handleDelete = async () => {
    if (!plan) {
      return;
    }
    const confirmed = window.confirm("Удалить план стажера?");
    if (!confirmed) {
      return;
    }

    try {
      setStatusType("loading");
      setStatus(FORM_STATUS_MESSAGES.deleteLoading);
      await deletePlan(plan.id).unwrap();
      navigate(ROUTES.MENTORSHIP_INTERNS);
    } catch {
      setStatusType("error");
      setStatus(FORM_STATUS_MESSAGES.deleteError);
    }
  };

  if (isLoading) {
    return (
      <OverflowScrollBlock header_name={"Редактирование плана"} button_back_visible={"enable"}>
        <Loader />
      </OverflowScrollBlock>
    );
  }

  if (isError || !plan) {
    return (
      <OverflowScrollBlock header_name={"Редактирование плана"} button_back_visible={"enable"}>
        <DataMessage type="error" />
        {loadErrorMessage && <p className={styles.status}>{loadErrorMessage}</p>}
      </OverflowScrollBlock>
    );
  }

  return (
    <OverflowScrollBlock
      header_name={"Редактирование плана стажера"}
      button_back_visible={"enable"}
    >
      <div className={styles.container}>
        <div className={styles.planSummaryCard}>
          <div className={styles.internSection}>
            <span className={styles.internCardLabel}>Стажер</span>
            <div className={styles.internName}>
              {plan.user?.name ?? `ID пользователя: ${plan.user_id}`}
            </div>
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>
              Дата начала
              <Input
                type="date"
                name="startDate"
                className={styles.dateInput}
                value={form.startDate}
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
              />
            </label>
            <label className={styles.label}>
              Шаблон адаптации
              <span className={styles.info}>
                {plan.template ? `${plan.template.name} (${plan.template.work_schedule})` : "—"}
              </span>
            </label>
            <label className={styles.label}>
              Смена
              <span className={styles.info}>Смена {form.shift}</span>
            </label>
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>
              Наставник
              <select
                className={styles.input}
                value={form.mentor ?? ""}
                onChange={(event) =>
                  setForm({ ...form, mentor: event.target.value ? Number(event.target.value) : null })
                }
              >
                <option value="">Выберите наставника</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Руководитель отдела
              <select
                className={styles.input}
                value={form.departmentHead ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    departmentHead: event.target.value ? Number(event.target.value) : null,
                  })
                }
              >
                <option value="">Выберите руководителя отдела</option>
                {heads.map((head) => (
                  <option key={head.id} value={head.id}>
                    {head.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.actionsBottom}>
            <IconButton
              type="save"
              onClick={handleSaveAll}
              disabled={isSavingPlan}
              className={isSavingPlan ? styles.iconDisabled : ""}
            />
            <IconButton
              type="delete"
              onClick={handleDelete}
              disabled={isDeleting}
              className={isDeleting ? styles.iconDisabled : ""}
            />
            {statusType !== "idle" && status && (
              <p className={styles.saveStatus}>{status}</p>
            )}
          </div>
        </div>

        {days.map((day, dayIndex) => (
          <div key={day.id} className={styles.dayCard}>
            <div className={styles.dayHeader}>День {day.work_day}</div>
            <div className={styles.formRow}>
              <label className={styles.label}>
                Дата
                <Input
                  type="date"
                  name={`dayDate-${day.id}`}
                  className={styles.dateInput}
                  value={day.date}
                  onChange={(event) =>
                    setDays((previous) => {
                      const next = [...previous];
                      next[dayIndex] = { ...next[dayIndex], date: event.target.value };
                      return next;
                    })
                  }
                />
              </label>
              <label className={styles.label}>
                Статус дня
                <select
                  className={styles.input}
                  value={day.completion}
                  onChange={(event) =>
                    setDays((previous) => {
                      const next = [...previous];
                      next[dayIndex] = {
                        ...next[dayIndex],
                        completion: event.target.value as "в процессе" | "выполнен" | "есть замечания",
                      };
                      return next;
                    })
                  }
                >
                  <option value="в процессе">В процессе</option>
                  <option value="выполнен">Выполнен</option>
                  <option value="есть замечания">Есть замечания</option>
                </select>
              </label>
            </div>

            <div className={styles.commentStack}>
              <label className={styles.label}>
                Комментарий УПиПК
                {commentPermissions.canEditEmployee ? (
                  <textarea
                    className={`${styles.input} ${styles.commentInput}`}
                    value={day.employee_comment}
                    onChange={(event) =>
                      setDays((previous) => {
                        const next = [...previous];
                        next[dayIndex] = { ...next[dayIndex], employee_comment: event.target.value };
                        return next;
                      })
                    }
                  />
                ) : (
                  <ReadonlyCommentBlock text={day.employee_comment} />
                )}
              </label>
              <label className={styles.label}>
                Комментарий стажера
                <ReadonlyCommentBlock text={day.intern_comment} />
              </label>
              <label className={styles.label}>
                Комментарий наставника
                {commentPermissions.canEditMentor ? (
                  <textarea
                    className={`${styles.input} ${styles.commentInput}`}
                    value={day.mentor_comment}
                    onChange={(event) =>
                      setDays((previous) => {
                        const next = [...previous];
                        next[dayIndex] = { ...next[dayIndex], mentor_comment: event.target.value };
                        return next;
                      })
                    }
                  />
                ) : (
                  <ReadonlyCommentBlock text={day.mentor_comment} />
                )}
              </label>
              <label className={styles.label}>
                Комментарий руководителя
                {commentPermissions.canEditDepartmentHead ? (
                  <textarea
                    className={`${styles.input} ${styles.commentInput}`}
                    value={day.department_head_comment}
                    onChange={(event) =>
                      setDays((previous) => {
                        const next = [...previous];
                        next[dayIndex] = {
                          ...next[dayIndex],
                          department_head_comment: event.target.value,
                        };
                        return next;
                      })
                    }
                  />
                ) : (
                  <ReadonlyCommentBlock text={day.department_head_comment} />
                )}
              </label>
            </div>

            <div className={styles.taskList}>
              {day.tasks.map((task, taskIndex) => (
                <div key={task.id} className={styles.taskRow}>
                  <span className={styles.taskName}>{task.description}</span>
                  <select
                    className={styles.input}
                    value={task.status}
                    onChange={(event) =>
                      setDays((previous) => {
                        const next = [...previous];
                        const tasks = [...next[dayIndex].tasks];
                        tasks[taskIndex] = {
                          ...tasks[taskIndex],
                          status: event.target.value as "выполнено" | "не выполнено",
                        };
                        next[dayIndex] = { ...next[dayIndex], tasks };
                        return next;
                      })
                    }
                  >
                    <option value="не выполнено">Не выполнено</option>
                    <option value="выполнено">Выполнено</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </OverflowScrollBlock>
  );
}

export default PlanEditor;
