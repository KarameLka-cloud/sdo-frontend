import { JSX, useState } from "react";
import { TaskType, TaskStatus } from "@/interfaces/api/AdaptationDayType.ts";

interface TaskItemProps {
  task: TaskType;
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

  const toExternalUrl = (link: string): string => {
    const trimmedLink = link.trim();

    if (/^https?:\/\//i.test(trimmedLink)) {
      return trimmedLink;
    }

    return `https://${trimmedLink}`;
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsSaving(true);
    try {
      await onUpdateTaskStatus?.(dayId, task.id, newStatus);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleColor = (role: string | undefined): string => {
    switch (role) {
      case "Руководитель отдела":
        return "bg-purple-600";
      case "Наставник":
        return "bg-sky-500";
      case "Сотрудник УПиПК":
        return "bg-amber-500";
      case "Стажер":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "выполнено":
        return "bg-green-50 text-green-800 border-green-200";
      case "не выполнено":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-shadow duration-200 hover:shadow-sm md:flex-row flex-col md:gap-4 gap-4">
      <div className="flex-1 flex flex-col gap-3">
        <p className="m-0 text-sm text-gray-900 leading-relaxed wrap-break-word">
          {task.description}
        </p>

        {task.responsibleRole && (
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="font-semibold text-gray-500">Ответственный:</span>
            <span
              className={`${getRoleColor(task.responsibleRole)} px-3 py-1.5 rounded-md text-sm font-semibold text-white`}
            >
              {task.responsibleRole}
            </span>
          </div>
        )}

        {task.links && task.links.length > 0 && (
          <div className="flex flex-row items-center gap-2 text-sm min-w-0">
            <span className="font-semibold text-gray-500">Ссылки:</span>
            <div className="inline-flex flex-nowrap gap-2 min-w-0 overflow-x-auto">
              {task.links.map((link, index) => (
                <a
                  key={`${link}-${index}`}
                  href={toExternalUrl(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 no-underline text-sm px-2 py-1 bg-blue-50 rounded border border-blue-100 transition-all duration-200 hover:bg-blue-100 hover:border-blue-200 hover:text-blue-700"
                >
                  Ссылка {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <button
            type="button"
            onClick={() => handleStatusChange("выполнено")}
            className={`
              px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-500
              cursor-pointer transition-all duration-200
              hover:border-gray-400 hover:text-gray-700
              disabled:opacity-60 disabled:cursor-not-allowed
              ${task.status === "выполнено" ? "bg-emerald-500 text-white border-transparent" : ""}
            `}
            title="Отметить как выполнено"
            disabled={isSaving}
          >
            ✓ Выполнено
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("не выполнено")}
            className={`
              px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-500
              cursor-pointer transition-all duration-200
              hover:border-gray-400 hover:text-gray-700
              disabled:opacity-60 disabled:cursor-not-allowed
              ${task.status === "не выполнено" ? "bg-red-500 text-white border-transparent" : ""}
            `}
            title="Отметить как не выполнено"
            disabled={isSaving}
          >
            ✕ Не выполнено
          </button>
        </div>
      </div>

      <div
        className={`
          px-3 py-1.5 rounded-lg text-xs font-semibold capitalize tracking-wide whitespace-nowrap shrink-0
          ${getStatusBadgeClass(task.status)} border
          md:self-auto self-start
        `}
      >
        {task.status}
      </div>
    </div>
  );
}

export default TaskItem;
