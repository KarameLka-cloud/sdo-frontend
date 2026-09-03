import { JSX, useState } from "react";
import PlanTaskRow from "@/components/adaptation/PlanTaskRow";
import type {
  AdaptationPlanTaskType,
  TaskStatus,
} from "@/interfaces/api/AdaptationPlanType.ts";

interface TaskItemProps {
  task: AdaptationPlanTaskType;
  dayId: number | undefined;
  onUpdateTaskStatus?: (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ) => Promise<void> | void;
}

function TaskItem({
  task,
  dayId,
  onUpdateTaskStatus,
}: TaskItemProps): JSX.Element {
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) {
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateTaskStatus?.(dayId, task.id, newStatus);
    } catch {
      // Status shown at Adaptation page level.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PlanTaskRow
      description={task.description}
      status={task.status}
      responsibleRole={task.responsible_role}
      links={task.links}
      disabled={isSaving}
      onStatusChange={(status) => void handleStatusChange(status)}
    />
  );
}

export default TaskItem;
