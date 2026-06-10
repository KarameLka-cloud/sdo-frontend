import { JSX, useState } from "react";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import Development from "@/components/ui/Development/Development";
import DataMessage from "@/components/ui/DataMessage/DataMessage";
import CareerDay from "@/components/ui/CareerDay/CareerDay";
import Loader from "@/components/ui/Loader/Loader";
import {
  useGetMyAdaptationPlanQuery,
  useUpdateMyAdaptationInternCommentMutation,
  useUpdateMyAdaptationTaskStatusMutation,
} from "@/services/store/features/user.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import FormActionStatus from "@/components/ui/FormActionStatus/FormActionStatus";
import styles from "./Adaptation.module.css";
import convertDate from "@/utils/convertDate.ts";
import {
  AdaptationDayType,
  TaskStatus,
} from "@/interfaces/api/AdaptationDayType.ts";

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
    day_from?: number | null;
    day_to?: number | null;
    date_from: string;
    date_to?: string | null;
    completion: "в процессе" | "выполнен" | "повторить" | "есть замечания";
    employee_comment?: string | null;
    intern_comment?: string | null;
    mentor_comment?: string | null;
    department_head_comment?: string | null;
    tasks?: Array<{
      id: number;
      description: string;
      status: "выполнено" | "не выполнено";
      responsible_role?:
        | "Руководитель отдела"
        | "Наставник"
        | "Сотрудник УПиПК"
        | "Стажер";
      links?: string[] | null;
    }>;
  }>;
}

function hasAdaptationPlan(
  plan: AdaptationPlanResponse | null | undefined,
): plan is AdaptationPlanResponse {
  return Boolean(
    plan && typeof plan.id === "number" && plan.id > 0 && plan.start_date,
  );
}

function Adaptation(): JSX.Element {
  const [updateInternComment] = useUpdateMyAdaptationInternCommentMutation();
  const [updateTaskStatus] = useUpdateMyAdaptationTaskStatusMutation();
  const [saveStatus, setSaveStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const {
    data: adaptationPlan,
    isLoading,
    isError,
  } = useGetMyAdaptationPlanQuery(undefined);

  const myAdaptationPlan = adaptationPlan as
    | AdaptationPlanResponse
    | null
    | undefined;
  const adaptationDays: AdaptationDayType[] =
    myAdaptationPlan?.days?.map((day) => ({
      id: day.id,
      workDay: day.work_day,
      dayFrom: day.day_from ?? undefined,
      dayTo: day.day_to ?? undefined,
      date: day.date_to
        ? `${convertDate(day.date_from)} - ${convertDate(day.date_to)}`
        : convertDate(day.date_from),
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

    setSaveStatus({
      type: "loading",
      message: FORM_STATUS_MESSAGES.saveLoading,
    });
    try {
      await updateInternComment({
        dayId,
        intern_comment: comment,
      }).unwrap();
      setSaveStatus({
        type: "success",
        message: FORM_STATUS_MESSAGES.saveSuccess,
      });
    } catch {
      setSaveStatus({ type: "error", message: FORM_STATUS_MESSAGES.saveError });
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

    setSaveStatus({
      type: "loading",
      message: FORM_STATUS_MESSAGES.saveLoading,
    });
    try {
      await updateTaskStatus({
        dayId,
        taskId,
        status,
      }).unwrap();
      setSaveStatus({
        type: "success",
        message: FORM_STATUS_MESSAGES.saveSuccess,
      });
    } catch {
      setSaveStatus({ type: "error", message: FORM_STATUS_MESSAGES.saveError });
      throw new Error("Task status update failed");
    }
  };

  if (isLoading) {
    return (
      <OverflowScrollBlock>
        <Loader />
      </OverflowScrollBlock>
    );
  }

  if (isError) {
    return (
      <OverflowScrollBlock>
        <DataMessage type={"error"} />
      </OverflowScrollBlock>
    );
  }

  if (!hasAdaptationPlan(myAdaptationPlan)) {
    return (
      <OverflowScrollBlock>
        <Development />
      </OverflowScrollBlock>
    );
  }

  // Отображение плана обучения и задач для сотрудника
  return (
    <OverflowScrollBlock>
      <div className={styles.trainingPlanInfo}>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Начало стажировки:</span>
          <span className={styles.planValue}>
            {convertDate(myAdaptationPlan.start_date)}
          </span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>График:</span>
          <span className={styles.planValue}>
            {myAdaptationPlan.work_schedule}
          </span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Смена:</span>
          <span className={styles.planValue}>{myAdaptationPlan.shift}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Наставник:</span>
          <span className={styles.planValue}>
            {myAdaptationPlan.mentor_user?.name ??
              `ID: ${myAdaptationPlan.mentor}`}
          </span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Руководитель отдела:</span>
          <span className={styles.planValue}>
            {myAdaptationPlan.department_head_user?.name ??
              `ID: ${myAdaptationPlan.department_head}`}
          </span>
        </div>
      </div>
      <FormActionStatus
        type={saveStatus.type}
        message={saveStatus.message}
        className={styles.saveStatusSlot}
      />

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
