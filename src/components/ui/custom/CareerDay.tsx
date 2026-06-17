import { JSX, useEffect, useState } from "react";
import {
  AdaptationDayType,
  TaskStatus,
} from "@/interfaces/api/AdaptationDayType.ts";
import IconButton from "@/components/ui/custom/IconButton";
import TaskItem from "@/components/ui/custom/TaskItem";
import { formatDayRange } from "@/utils/formatDayRange.ts";

interface CareerDayProps {
  day: AdaptationDayType;
  onUpdateInternComment?: (
    dayId: number | undefined,
    comment: string,
  ) => Promise<void> | void;
  onUpdateTaskStatus?: (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ) => Promise<void> | void;
}

function CareerDay({
  day,
  onUpdateInternComment,
  onUpdateTaskStatus,
}: CareerDayProps): JSX.Element {
  const [isEditingInternComment, setIsEditingInternComment] = useState(false);
  const [editedInternComment, setEditedInternComment] = useState(
    day.internComment || "",
  );
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  useEffect(() => {
    setEditedInternComment(day.internComment || "");
  }, [day.internComment]);

  const handleSaveInternComment = async () => {
    try {
      await onUpdateInternComment?.(day.id, editedInternComment);
      setIsEditingInternComment(false);
    } catch {
      // Status shown at Adaptation page level.
    }
  };

  const handleCancelInternComment = () => {
    setEditedInternComment(day.internComment || "");
    setIsEditingInternComment(false);
  };

  const dayRangeLabel = formatDayRange(day.dayFrom, day.dayTo, day.workDay);

  const getStatusClass = (completion: string) => {
    const statusMap: Record<string, string> = {
      "В процессе": "bg-amber-50 text-amber-800 border-amber-300",
      Выполнен: "bg-green-50 text-green-800 border-green-300",
      Повторить: "bg-red-50 text-red-800 border-red-300",
      "Есть замечания": "bg-indigo-50 text-indigo-800 border-indigo-300",
    };
    return statusMap[completion] || "bg-gray-50 text-gray-800 border-gray-300";
  };

  return (
    <div className="flex flex-col gap-6 p-6 mb-6 rounded-2xl bg-white border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 items-stretch pb-4 border-b border-gray-200">
        <div className="flex flex-col justify-center gap-1.5 min-h-20 p-3 rounded-xl bg-gray-50/50 border border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            День
          </span>
          <span className="text-[0.95rem] font-medium text-gray-900">
            {dayRangeLabel}
          </span>
        </div>

        <div className="flex flex-col justify-center gap-1.5 min-h-20 p-3 rounded-xl bg-gray-50/50 border border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Дата
          </span>
          <span className="text-[0.95rem] font-medium text-gray-900">
            {day.date}
          </span>
        </div>

        <div className="flex flex-col justify-center gap-1.5 min-h-20 p-3 rounded-xl bg-gray-50/50 border border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Статус дня
          </span>
          <span
            className={`inline-block w-fit px-3 py-1.5 rounded-lg text-sm font-semibold capitalize tracking-wide border ${getStatusClass(day.completion)}`}
          >
            {day.completion}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        {/* Information Section */}
        <div className="flex flex-col gap-4">
          <h3 className="m-0 text-[0.95rem] font-semibold text-gray-900 uppercase tracking-wider">
            Информация
          </h3>
          <div className="flex flex-col gap-3">
            {Array.isArray(day.tasks) && day.tasks.length > 0 ? (
              day.tasks.map((task, index) => (
                <TaskItem
                  key={task.id ?? index}
                  task={task}
                  dayId={day.id}
                  onUpdateTaskStatus={onUpdateTaskStatus}
                />
              ))
            ) : (
              <p className="m-0 text-sm text-gray-500 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                На этот день задачи не назначены
              </p>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
            className="flex items-center justify-between gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer text-left transition-all duration-200 hover:bg-gray-100"
            aria-expanded={isCommentsExpanded}
          >
            <span className="m-0 text-[0.95rem] font-semibold text-gray-900 uppercase tracking-wider group-hover:text-blue-600">
              Комментарии
            </span>
            <span
              className={`text-xs text-gray-500 inline-flex items-center shrink-0 transition-transform duration-300 ${
                isCommentsExpanded ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {isCommentsExpanded && (
            <div className="flex flex-col gap-4">
              {/* Employee Comment */}
              <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Комментарий сотрудника УПиПК
                </span>
                <p className="m-0 text-sm text-gray-900 leading-relaxed py-2">
                  {day.employeeComment || "Нет комментария"}
                </p>
              </div>

              {/* Intern Comment */}
              {day.internComment !== undefined && (
                <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Комментарий стажера
                  </span>
                  {isEditingInternComment ? (
                    <div className="flex flex-col gap-3">
                      <textarea
                        value={editedInternComment}
                        onChange={(e) => setEditedInternComment(e.target.value)}
                        className="w-full box-border p-3 border border-gray-300 rounded-lg text-sm font-inherit text-gray-900 resize-y min-h-25 leading-relaxed focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                        placeholder="Введите комментарий..."
                      />
                      <div className="flex gap-2 justify-start items-center flex-wrap">
                        <IconButton
                          type="save"
                          onClick={() => void handleSaveInternComment()}
                        />
                        <IconButton
                          type="close"
                          onClick={handleCancelInternComment}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-2">
                      <p className="m-0 text-sm text-gray-900 leading-relaxed py-2">
                        {editedInternComment || "Нет комментария"}
                      </p>
                      <IconButton
                        type="edit"
                        onClick={() => setIsEditingInternComment(true)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Mentor Comment */}
              <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Комментарий наставника
                </span>
                <p className="m-0 text-sm text-gray-900 leading-relaxed py-2">
                  {day.mentorComment || "Нет комментария"}
                </p>
              </div>

              {/* Department Head Comment */}
              <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Комментарий руководителя отдела
                </span>
                <p className="m-0 text-sm text-gray-900 leading-relaxed py-2">
                  {day.departmentHeadComment || "Нет комментария"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CareerDay;
