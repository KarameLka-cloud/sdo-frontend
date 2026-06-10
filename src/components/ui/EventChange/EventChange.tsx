import { JSX } from "react";
import styles from "./EventChange.module.css";
import { EventType } from "@/interfaces/api/EventType.ts";
import convertDate from "@/utils/convertDate.ts";
import { useDelete } from "@/hooks/useDelete.ts";
import { convertTime } from "@/utils/convertTime.ts";
import IconButton from "../IconButton/IconButton.tsx";

interface EventPropsType {
  className?: string;
  event: EventType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function EventChange({
  className,
  event,
  mutationDelete,
}: EventPropsType): JSX.Element {
  const handleDelete = useDelete(mutationDelete, "Удалить мероприятие?");

  return (
    <div className={`${styles.event} ${className}`}>
      <div className={styles.content}>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.description}>{event.description}</span>
        {event.link && <span className={styles.link}>{event.link}</span>}
        <span className={styles.department}>
          {event.department}{" "}
          {event.note_department && `(${event.note_department})`}
        </span>
        <span className={styles.date_time}>
          {convertDate(event.date)}{" "}
          {event.time && `| ${convertTime(event.time)}`}
        </span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(event.id)}
        className={styles.button_delete}
      />
    </div>
  );
}

export default EventChange;
