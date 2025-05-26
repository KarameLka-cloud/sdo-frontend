import {JSX} from "react";
import style from "./Event.module.css";

type Event = {
    id: number;
    title: string;
    description: string;
    department: string;
    time: string;
    date: string;
};

type EventProps = {
    event: Event;
}

function Event({event}: EventProps): JSX.Element {
    return (
        <div className={style.event}>
            <div className={style.event_content}>
                <span className={style.event_title}>{event.title}</span>
                <span className={style.event_description}>{event.description}</span>
                <span className={style.event_departments}>{event.department}</span>
            </div>
            <div className={style.event_time}>
                <div style={{textAlign: "center"}}>{event.time}</div>
                <div style={{textAlign: "center"}}>{event.date}</div>
            </div>
        </div>
    );
}

export default Event;
