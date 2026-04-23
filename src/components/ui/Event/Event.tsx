import { JSX } from "react";
import styles from "./Event.module.css";
import convertDate from "@utils/convertDate.ts";
import { EventType } from "@interfaces/api/EventType.ts";
import { convertTime } from "@utils/convertTime.ts";
import icon_link from "@assets/images/icons/link.svg";

interface EventPropsType {
  className?: string;
  event: EventType;
}

function Event({ className, event }: EventPropsType): JSX.Element {
  return (
    <div className={`${styles.event} ${className}`}>
      <div>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.description}>{event.description}</span>
        <span className={styles.department}>
          {event.department}{" "}
          {event.note_department && `(${event.note_department})`}
        </span>
      </div>
      <div className={styles.links}>
        {event.link && (
          <img
            src={icon_link}
            onClick={() => window.open(event.link, "_blank")}
            alt={"Ссылка"}
            className={styles.icon}
          />
        )}
      </div>
      <div className={styles.time}>
        {event.time && (
          <span style={{ textAlign: "center" }}>{convertTime(event.time)}</span>
        )}
        <span style={{ textAlign: "center" }}>{convertDate(event.date)}</span>
      </div>
    </div>
  );
}

export default Event;
