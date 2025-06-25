import {JSX} from "react";
import style from "./Event.module.css";
import {useDeleteEdoEventMutation} from "../../../services/store/features/edoApi.ts";

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
    delete?: boolean;
}

function Event({event, delete: deleteEventButton = false}: EventProps): JSX.Element {
    const [deleteEvent] = useDeleteEdoEventMutation();

    const handleDeleteEvent = async (id: number) => {
        await deleteEvent(id).unwrap();
    }

    return (
        <div className={style.event}>
            <div className={style.event_content}>
                <span className={style.event_title}>{event.title}</span>
                <span className={style.event_description}>{event.description}</span>
                <span className={style.event_departments}>{event.department}</span>
            </div>
            {
                deleteEventButton ? (
                    <div onClick={() => handleDeleteEvent(event.id)} className={style.delete_button}>
                        <img src="/src/assets/images/icons/trash.svg" alt="Кнопка удалить" className="trash_icon"/>
                    </div>
                ) : null
            }
            <div className={style.event_time}>
                <div style={{textAlign: "center"}}>{event.time}</div>
                <div style={{textAlign: "center"}}>{event.date}</div>
            </div>
        </div>
    );
}

export default Event;
