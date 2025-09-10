import {JSX} from "react";
import styles from "./Event.module.css";
import convertDate from "../../../utils/convertDate.ts";
import {EventType} from "../../../interfaces/api/EventType.ts";
import {convertTime} from "../../../utils/convertTime.ts";

interface EventPropsType {
    className?: string;
    event: EventType;
}

function Event({className, event}: EventPropsType): JSX.Element {
    return (
        <div className={`${styles.event} + ${className}`}>
            <div>
                <span className={styles.title}>{event.title}</span>
                <span className={styles.description}>{event.description}</span>
                <span className={styles.departments}>{event.department}</span>
            </div>
            <div className={styles.time}>
                <div style={{textAlign: "center"}}>{convertTime(event.time)}</div>
                <div style={{textAlign: "center"}}>{convertDate(event.date)}</div>
            </div>
        </div>
    );
}

export default Event;
