import {JSX} from "react";
import style from "./Event.module.css";
import {EventType} from "../../../types";

function Event({event, mutation}: EventType): JSX.Element {
    const handleDeleteEvent = async (id: number) => {
        const isDelete = confirm("Вы хотите удалить запись?");
        if (isDelete) {
            await mutation(id).unwrap();
        }
    }

    return (
        <div className={style.event}>
            <div className={style.event_content}>
                <span className={style.event_title}>{event.title}</span>
                <span className={style.event_description}>{event.description}</span>
                <span className={style.event_departments}>{event.department}</span>
            </div>
            {
                mutation ? (
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
