import { JSX, useState } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import Development from "@components/ui/Development/Development.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import CareerDay from "@components/ui/CareerDay/CareerDay.tsx";
import Loader from "@components/ui/Loader/Loader.tsx";
import {
  useGetMyAdaptationPlanQuery,
  useUpdateMyAdaptationInternCommentMutation,
  useUpdateMyAdaptationTaskStatusMutation,
} from "@services/store/features/user.ts";
import styles from "./Adaptation.module.css";
import convertDate from "@utils/convertDate.ts";
import { AdaptationDayType, TaskStatus } from "@interfaces/api/AdaptationDayType.ts";

interface AdaptationPlanResponse {
  id: number;
  user_id: number;
  start_date: string;
  work_schedule: string;
  shift: number;
  mentor: number;
  department_head: number;
  mentor_user?: {
    id?: number;
    name?: string;
  };
  department_head_user?: {
    id?: number;
    name?: string;
  };
  user?: {
    id?: number;
    name?: string;
  };
  days?: Array<{
    id: number;
    work_day: number;
    date: string;
    completion: "в процессе" | "выполнен" | "повторить" | "есть замечания";
    employee_comment?: string | null;
    intern_comment?: string | null;
    mentor_comment?: string | null;
    department_head_comment?: string | null;
    tasks?: Array<{
      id: number;
      description: string;
      status: "выполнено" | "не выполнено";
      responsible_role?: "Руководитель отдела" | "Наставник" | "Сотрудник УПиПК" | "Стажер";
      links?: string[] | null;
    }>;
  }>;
}

function hasAdaptationPlan(
  plan: AdaptationPlanResponse | null | undefined,
): plan is AdaptationPlanResponse {
  return Boolean(plan && typeof plan.id === "number" && plan.id > 0 && plan.start_date);
}

function Adaptation(): JSX.Element {
  const [updateInternComment] = useUpdateMyAdaptationInternCommentMutation();
  const [updateTaskStatus] = useUpdateMyAdaptationTaskStatusMutation();
  const [saveStatus, setSaveStatus] = useState<{
    type: "idle" | "saving" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const {
    data: adaptationPlan,
    isLoading,
    isError,
  } = useGetMyAdaptationPlanQuery(undefined);

  const myAdaptationPlan = adaptationPlan as AdaptationPlanResponse | null | undefined;
  const adaptationDays: AdaptationDayType[] =
    myAdaptationPlan?.days?.map((day) => ({
      id: day.id,
      workDay: day.work_day,
      date: convertDate(day.date),
      completion: day.completion,
      responsible: myAdaptationPlan.mentor_user?.name ?? "Наставник",
      employeeComment: day.employee_comment ?? "",
      internComment: day.intern_comment ?? "",
      mentorComment: day.mentor_comment ?? "",
      departmentHeadComment: day.department_head_comment ?? "",
      tasks:
        day.tasks?.map((task) => ({
          id: task.id,
          description: task.description,
          status: task.status,
          responsibleRole: task.responsible_role,
          links: task.links ?? [],
        })) ?? [],
    })) ?? [];

  const handleUpdateInternComment = async (
    dayId: number | undefined,
    comment: string,
  ): Promise<void> => {
    if (!dayId) {
      return;
    }

    setSaveStatus({ type: "saving", message: "Сохранение комментария..." });
    try {
      await updateInternComment({
        dayId,
        intern_comment: comment,
      }).unwrap();
      setSaveStatus({ type: "success", message: "Комментарий сохранен" });
    } catch {
      setSaveStatus({ type: "error", message: "Не удалось сохранить комментарий" });
      throw new Error("Intern comment update failed");
    }
  };

  const handleUpdateTaskStatus = async (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ): Promise<void> => {
    if (!dayId || !taskId) {
      return;
    }

    setSaveStatus({ type: "saving", message: "Сохранение статуса задачи..." });
    try {
      await updateTaskStatus({
        dayId,
        taskId,
        status,
      }).unwrap();
      setSaveStatus({ type: "success", message: "Статус задачи сохранен" });
    } catch {
      setSaveStatus({ type: "error", message: "Не удалось сохранить статус задачи" });
      throw new Error("Task status update failed");
    }
  };

  if (isLoading) {
    return (
      <OverflowScrollBlock header_name={"Адаптация"}>
        <Loader />
      </OverflowScrollBlock>
    );
  }

  if (isError) {
    return (
      <OverflowScrollBlock header_name={"Адаптация"}>
        <DataMessage type={"error"} />
      </OverflowScrollBlock>
    );
  }

  if (!hasAdaptationPlan(myAdaptationPlan)) {
    return (
      <OverflowScrollBlock header_name={"Адаптация"}>
        <Development />
      </OverflowScrollBlock>
    );
  }

  // Отображение плана обучения и задач для сотрудника
  return (
    <OverflowScrollBlock header_name={"Адаптация"}>
      <div className={styles.trainingPlanInfo}>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Начало стажировки:</span>
          <span className={styles.planValue}>{convertDate(myAdaptationPlan.start_date)}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>График:</span>
          <span className={styles.planValue}>{myAdaptationPlan.work_schedule}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Смена:</span>
          <span className={styles.planValue}>{myAdaptationPlan.shift}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Наставник:</span>
          <span className={styles.planValue}>
            {myAdaptationPlan.mentor_user?.name ?? `ID: ${myAdaptationPlan.mentor}`}
          </span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Руководитель отдела:</span>
          <span className={styles.planValue}>
            {myAdaptationPlan.department_head_user?.name ?? `ID: ${myAdaptationPlan.department_head}`}
          </span>
        </div>
      </div>
      {saveStatus.type !== "idle" && (
        <p
          className={`${styles.saveStatus} ${
            saveStatus.type === "error"
              ? styles.saveStatusError
              : saveStatus.type === "success"
                ? styles.saveStatusSuccess
                : styles.saveStatusLoading
          }`}
        >
          {saveStatus.message}
        </p>
      )}

      <div className={styles.careerContainer}>
        {adaptationDays.length > 0 ? (
          adaptationDays.map((day) => (
            <CareerDay
              key={day.id}
              day={day}
              onUpdateInternComment={handleUpdateInternComment}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          ))
        ) : (
          <Development />
        )}
      </div>
    </OverflowScrollBlock>
  );
}

export default Adaptation;
