import { JSX } from "react";
import styles from "./CourseChange.module.css";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import convertDate from "@/utils/convertDate.ts";
import { useDelete } from "@/hooks/useDelete.ts";
import IconButton from "../IconButton/IconButton.tsx";

interface CoursePropsType {
  className?: string;
  course: CourseType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function CourseChange({
  className,
  course,
  mutationDelete,
}: CoursePropsType): JSX.Element {
  const handleDelete = useDelete(mutationDelete, "Удалить курс?");

  return (
    <div className={`${styles.course} ${className}`}>
      <div className={styles.content}>
        <span className={styles.title}>{course.title}</span>
        <span className={styles.url}>{course.url}</span>
        <span className={styles.department}>
          {course.department}{" "}
          {course.note_department && `(${course.note_department})`}
        </span>
        <span className={styles.date_end}>{convertDate(course.date_end)}</span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(course.id)}
        className={styles.button_delete}
      />
    </div>
  );
}

export default CourseChange;
