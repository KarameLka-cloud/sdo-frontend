import {JSX} from "react";
import style from "./Event.module.css";
import convertDate from "../../../utils/convertDate.ts";
import {EventType} from "../../../types/components/EventType";

type EventProps = {
    className?: string;
    event: EventType;
}

function Event({className, event}: EventProps): JSX.Element {
    return (
        <div className={`${style.event} + ${className}`}>
            <div>
                <span className={style.title}>{event.title}</span>
                <span className={style.description}>{event.description}</span>
                <span className={style.departments}>{event.department}</span>
            </div>
            <div className={style.time}>
                <div style={{textAlign: "center"}}>{event.time}</div>
                <div style={{textAlign: "center"}}>{convertDate(event.date)}</div>
            </div>
        </div>
    );
}

export default Event;
