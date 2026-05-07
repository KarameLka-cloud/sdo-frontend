import { JSX, useEffect, useState } from "react";
import styles from "./CareerDay.module.css";
import {
  AdaptationDayType,
  TaskStatus,
} from "@interfaces/api/AdaptationDayType.ts";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import TaskItem from "@components/ui/TaskItem/TaskItem.tsx";

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

  const dayRangeLabel = (() => {
    const from = day.dayFrom ?? day.workDay;
    const to = day.dayTo ?? from;
    return from === to ? `${from}` : `${from}-${to}`;
  })();

  return (
    <div className={styles.careerDay}>
      <div className={styles.header}>
        <div className={styles.headerItem}>
          <span className={styles.label}>День</span>
          <span className={styles.value}>{dayRangeLabel}</span>
        </div>
        <div className={styles.headerItem}>
          <span className={styles.label}>Дата</span>
          <span className={styles.value}>{day.date}</span>
        </div>
        <div className={`${styles.headerItem} ${styles.statusHeaderItem}`}>
          <span className={styles.label}>Статус дня</span>
          <span
            className={`${styles.statusBadge} ${styles[`status_${day.completion.replace(/ /g, "_")}` as keyof typeof styles]}`}
          >
            {day.completion}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Информация</h3>
          <div className={styles.tasksContainer}>
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
              <p className={styles.emptyTasks}>
                На этот день задачи не назначены
              </p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <button
            type="button"
            onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
            className={styles.sectionToggle}
            aria-expanded={isCommentsExpanded}
          >
            <span className={styles.sectionTitle}>Комментарии</span>
            <span
              className={`${styles.toggleIcon} ${isCommentsExpanded ? styles.expanded : ""}`}
            >
              ▼
            </span>
          </button>

          {isCommentsExpanded && (
            <>
              <div className={styles.commentItem}>
                <span className={styles.commentLabel}>
                  Комментарий сотрудника УПиПК
                </span>
                <p className={styles.commentText}>
                  {day.employeeComment || "Нет комментария"}
                </p>
              </div>

              {day.internComment !== undefined && (
                <div className={styles.commentItem}>
                  <span className={styles.commentLabel}>
                    Комментарий стажера
                  </span>
                  {isEditingInternComment ? (
                    <div className={styles.editForm}>
                      <textarea
                        value={editedInternComment}
                        onChange={(e) => setEditedInternComment(e.target.value)}
                        className={styles.textarea}
                        placeholder="Введите комментарий..."
                      />
                      <div className={styles.iconButtonGroup}>
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
                    <div className={styles.commentContent}>
                      <p className={styles.commentText}>
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

              <div className={styles.commentItem}>
                <span className={styles.commentLabel}>
                  Комментарий наставника
                </span>
                <p className={styles.commentText}>
                  {day.mentorComment || "Нет комментария"}
                </p>
              </div>

              <div className={styles.commentItem}>
                <span className={styles.commentLabel}>
                  Комментарий руководителя отдела
                </span>
                <p className={styles.commentText}>
                  {day.departmentHeadComment || "Нет комментария"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CareerDay;
