import { JSX } from "react";
import styles from "./TaskItem.module.css";
import { TaskType, TaskStatus } from "@interfaces/api/AdaptationDayType.ts";

interface TaskItemProps {
  task: TaskType;
  dayId: number | undefined;
  onUpdateTaskStatus?: (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ) => void;
}

function TaskItem({
  task,
  dayId,
  onUpdateTaskStatus,
}: TaskItemProps): JSX.Element {
  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdateTaskStatus?.(dayId, task.id, newStatus);
  };

  const getRoleColor = (role: string | undefined): string => {
    switch (role) {
      case "Руководитель отдела":
        return styles.roleDepartmentHead;
      case "Наставник":
        return styles.roleMentor;
      case "Сотрудник УПиПК":
        return styles.roleEmployee;
      case "Стажер":
        return styles.roleIntern;
      default:
        return styles.roleDefault;
    }
  };

  return (
    <div className={styles.taskItem}>
      <div className={styles.taskContent}>
        <p className={styles.taskDescription}>{task.description}</p>
        {task.responsibleRole && (
          <div className={styles.responsibleInfo}>
            <span className={styles.responsibleLabel}>Ответственный:</span>
            <span
              className={`${styles.responsibleRole} ${getRoleColor(task.responsibleRole)}`}
            >
              {task.responsibleRole}
            </span>
          </div>
        )}
        {task.links && task.links.length > 0 && (
          <div className={styles.linksInfo}>
            <span className={styles.linksLabel}>Ссылки:</span>
            <div className={styles.linksList}>
              {task.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Ссылка {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className={styles.statusButtons}>
          <button
            onClick={() => handleStatusChange("выполнено")}
            className={`${styles.statusButton} ${task.status === "выполнено" ? styles.active : ""} ${styles.completed}`}
            title="Отметить как выполнено"
          >
            ✓ Выполнено
          </button>
          <button
            onClick={() => handleStatusChange("не выполнено")}
            className={`${styles.statusButton} ${task.status === "не выполнено" ? styles.active : ""} ${styles.notCompleted}`}
            title="Отметить как не выполнено"
          >
            ✕ Не выполнено
          </button>
        </div>
      </div>
      <div
        className={`${styles.statusBadge} ${styles[`status_${task.status.replace(/ /g, "_")}` as keyof typeof styles]}`}
      >
        {task.status}
      </div>
    </div>
  );
}

export default TaskItem;
