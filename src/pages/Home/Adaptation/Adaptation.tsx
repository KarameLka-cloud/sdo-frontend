import { JSX, useState } from "react";
import Development from "@/components/ui/custom/Development";
import DataMessage from "@/components/ui/custom/DataMessage";
import CareerDay from "@/components/ui/custom/CareerDay";
import Loader from "@/components/ui/custom/Loader";
import {
  useGetMyAdaptationPlanQuery,
  useUpdateMyAdaptationInternCommentMutation,
  useUpdateMyAdaptationTaskStatusMutation,
} from "@/services/store/features/user.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import FormActionStatus from "@/components/ui/custom/FormActionStatus";
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
    return <Loader />;
  }

  if (isError) {
    return <DataMessage type={"error"} />;
  }

  if (!hasAdaptationPlan(myAdaptationPlan)) {
    return <Development />;
  }

  // Отображение плана обучения и задач для сотрудника
  return (
    <>
      {/* Блок информации о плане - sticky */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-4 flex flex-wrap gap-2 items-center sticky top-0 z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-100">
          <span className="font-semibold text-slate-600 text-xs">
            Начало стажировки:
          </span>
          <span className="text-slate-900 font-semibold text-xs">
            {convertDate(myAdaptationPlan.start_date)}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-100">
          <span className="font-semibold text-slate-600 text-xs">График:</span>
          <span className="text-slate-900 font-semibold text-xs">
            {myAdaptationPlan.work_schedule}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-100">
          <span className="font-semibold text-slate-600 text-xs">Смена:</span>
          <span className="text-slate-900 font-semibold text-xs">
            {myAdaptationPlan.shift}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-100">
          <span className="font-semibold text-slate-600 text-xs">
            Наставник:
          </span>
          <span className="text-slate-900 font-semibold text-xs">
            {myAdaptationPlan.mentor_user?.name ??
              `ID: ${myAdaptationPlan.mentor}`}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-100">
          <span className="font-semibold text-slate-600 text-xs">
            Руководитель отдела:
          </span>
          <span className="text-slate-900 font-semibold text-xs">
            {myAdaptationPlan.department_head_user?.name ??
              `ID: ${myAdaptationPlan.department_head}`}
          </span>
        </div>
      </div>

      <FormActionStatus
        type={saveStatus.type}
        message={saveStatus.message}
        className="mb-4"
      />

      <div className="flex flex-col gap-0">
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
    </>
  );
}

export default Adaptation;
