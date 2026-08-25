import { JSX, useState } from "react";
import Development from "@/components/ui/custom/Development";
import DataMessage, {
  DataStateCenter,
} from "@/components/ui/custom/DataMessage";
import CareerDay from "@/components/ui/custom/CareerDay";
import Loader from "@/components/ui/custom/Loader";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
  useGetMyAdaptationPlanQuery,
  useUpdateMyAdaptationInternCommentMutation,
  useUpdateMyAdaptationTaskStatusMutation,
} from "@/services/store/features/user.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import FormActionStatus, {
  type FormActionStatusType,
} from "@/components/ui/custom/FormActionStatus";
import convertDate from "@/utils/convertDate.ts";
import {
  AdaptationDayType,
  TaskStatus,
} from "@/interfaces/api/AdaptationDayType.ts";

interface AdaptationPlan {
  id?: number;
  start_date: string;
  work_schedule: string;
  shift: number;
  mentor: number;
  department_head: number;
  mentor_user?: { name?: string };
  department_head_user?: { name?: string };
  days?: {
    id: number;
    work_day: number;
    day_from?: number | null;
    day_to?: number | null;
    date_from: string;
    date_to?: string | null;
    completion: AdaptationDayType["completion"];
    employee_comment?: string | null;
    intern_comment?: string | null;
    mentor_comment?: string | null;
    department_head_comment?: string | null;
    tasks?: {
      id: number;
      description: string;
      status: TaskStatus;
      responsible_role?: AdaptationDayType["tasks"][number]["responsibleRole"];
      links?: string[] | null;
    }[];
  }[];
}

const INFO_BADGE_CLASS =
  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-100";

function formatDayDate(dateFrom: string, dateTo?: string | null): string {
  const from = convertDate(dateFrom);
  return dateTo ? `${from} - ${convertDate(dateTo)}` : from;
}

function mapPlanDays(plan: AdaptationPlan): AdaptationDayType[] {
  return (plan.days ?? []).map((day) => ({
    id: day.id,
    workDay: day.work_day,
    dayFrom: day.day_from ?? undefined,
    dayTo: day.day_to ?? undefined,
    date: formatDayDate(day.date_from, day.date_to),
    completion: day.completion,
    employeeComment: day.employee_comment ?? "",
    internComment: day.intern_comment ?? "",
    mentorComment: day.mentor_comment ?? "",
    departmentHeadComment: day.department_head_comment ?? "",
    tasks: (day.tasks ?? []).map((task) => ({
      id: task.id,
      description: task.description,
      status: task.status,
      responsibleRole: task.responsible_role,
      links: task.links ?? [],
    })),
  }));
}

async function runSave(
  setSaveStatus: (status: {
    type: FormActionStatusType;
    message: string;
  }) => void,
  action: () => Promise<unknown>,
): Promise<void> {
  setSaveStatus({ type: "loading", message: FORM_STATUS_MESSAGES.saveLoading });
  try {
    await action();
    setSaveStatus({
      type: "success",
      message: FORM_STATUS_MESSAGES.saveSuccess,
    });
  } catch {
    setSaveStatus({ type: "error", message: FORM_STATUS_MESSAGES.saveError });
    throw new Error("Save failed");
  }
}

function Adaptation(): JSX.Element {
  const [updateInternComment] = useUpdateMyAdaptationInternCommentMutation();
  const [updateTaskStatus] = useUpdateMyAdaptationTaskStatusMutation();
  const [saveStatus, setSaveStatus] = useState<{
    type: FormActionStatusType;
    message: string;
  }>({ type: "idle", message: "" });
  const { data, isLoading, isError } = useGetMyAdaptationPlanQuery(undefined);

  const plan = data as AdaptationPlan | undefined;
  const hasPlan = Boolean(plan?.id && plan.id > 0);

  const handleUpdateInternComment = async (
    dayId: number | undefined,
    comment: string,
  ): Promise<void> => {
    if (!dayId) return;

    await runSave(setSaveStatus, () =>
      updateInternComment({ dayId, intern_comment: comment }).unwrap(),
    );
  };

  const handleUpdateTaskStatus = async (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ): Promise<void> => {
    if (!dayId || !taskId) return;

    await runSave(setSaveStatus, () =>
      updateTaskStatus({ dayId, taskId, status }).unwrap(),
    );
  };

  if (isLoading) {
    return (
      <DataStateCenter>
        <Loader />
      </DataStateCenter>
    );
  }
  if (isError) return <DataMessage type="error" centered />;
  if (!hasPlan || !plan) return <Development />;

  const adaptationDays = mapPlanDays(plan);
  const planInfo = [
    ["Начало стажировки:", convertDate(plan.start_date)],
    ["График:", plan.work_schedule],
    ["Смена:", plan.shift],
    ["Наставник:", plan.mentor_user?.name ?? `ID: ${plan.mentor}`],
    [
      "Руководитель отдела:",
      plan.department_head_user?.name ?? `ID: ${plan.department_head}`,
    ],
  ] as const;

  return (
    <>
      <div className="sticky top-0 z-10 mb-4">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {planInfo.map(([label, value]) => (
                <div key={label} className={INFO_BADGE_CLASS}>
                  <span className="text-xs font-semibold text-slate-600">
                    {label}
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
