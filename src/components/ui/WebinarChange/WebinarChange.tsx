import { JSX } from "react";
import styles from "./WebinarChange.module.css";
import { WebinarType } from "@interfaces/api/WebinarType.ts";
import convertDate from "@utils/convertDate.ts";
import { useDelete } from "@hooks/useDelete.ts";
import { convertTime } from "@utils/convertTime.ts";
import IconButton from "../IconButton/IconButton.tsx";

interface EventPropsType {
  className?: string;
  webinar: WebinarType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function WebinarChange({
  className,
  webinar,
  mutationDelete,
}: EventPropsType): JSX.Element {
  const handleDelete = useDelete(mutationDelete, "Удалить вебинар?");

  return (
    <div className={`${styles.webinar} ${className}`}>
      <div className={styles.content}>
        <span className={styles.title}>{webinar.title}</span>
        <span className={styles.date_time}>
          {`${convertDate(webinar.date)} | ${convertTime(webinar.time_start)}-${convertTime(webinar.time_end)}`}
        </span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(webinar.id)}
        className={styles.button_delete}
      />
    </div>
  );
}

export default WebinarChange;
