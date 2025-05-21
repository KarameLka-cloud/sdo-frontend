import {JSX} from "react";
import style from "./EventItem.module.css";

type EventItem = {
    id: number;
    title: string;
    description: string;
    department: string;
    time: string;
    date: string;
};

type EventProps = {
    event: EventItem;
}

function EventItem({event}: EventProps): JSX.Element {
    return (
        <div className={style.event} key={event.id}>
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
    )
}

export default EventItem;
