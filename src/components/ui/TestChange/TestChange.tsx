import { TestType } from "@/interfaces/api/TestType.ts";
import { useDelete } from "@/hooks/useDelete.ts";
import styles from "./TestChange.module.css";
import convertDate from "@/utils/convertDate.ts";
import { JSX } from "react";
import IconButton from "../IconButton/IconButton.tsx";

interface TestPropsType {
  className?: string;
  test: TestType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function TestChange({
  className,
  test,
  mutationDelete,
}: TestPropsType): JSX.Element {
  const handleDelete = useDelete(mutationDelete, "Удалить тест?");

  return (
    <div className={`${styles.test} ${className}`}>
      <div className={styles.content}>
        <span className={styles.title}>{test.title}</span>
        <span className={styles.url}>{test.url}</span>
        <span className={styles.position}>
          {test.position} {test.note_position && `(${test.note_position})`}
        </span>
        <span className={styles.date_end}>{convertDate(test.date_end)}</span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(test.id)}
        className={styles.button_delete}
      />
    </div>
  );
}

export default TestChange;
