import {JSX} from "react";
import styles from "./TaskItem.module.css";
import {TaskType, TaskStatus} from "@interfaces/api/CareerDayType.ts";

interface TaskItemProps {
    task: TaskType;
    dayId: number | undefined;
    onUpdateTaskStatus?: (dayId: number | undefined, taskId: number | undefined, status: TaskStatus) => void;
}

function TaskItem({task, dayId, onUpdateTaskStatus}: TaskItemProps): JSX.Element {
    const handleStatusChange = (newStatus: TaskStatus) => {
        onUpdateTaskStatus?.(dayId, task.id, newStatus);
    };

    return (
        <div className={styles.taskItem}>
            <div className={styles.taskContent}>
                <p className={styles.taskDescription}>{task.description}</p>
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
            <div className={`${styles.statusBadge} ${styles[`status_${task.status.replace(/ /g, '_')}` as keyof typeof styles]}`}>
                {task.status}
            </div>
        </div>
    );
}

export default TaskItem;
