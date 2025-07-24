import {JSX} from "react";
import style from "./Event.module.css";
import convertDate from "../../../utils/convertDate.ts";
import icon_trash from "../../../assets/images/icons/trash.svg";
import {EventType} from "../../../types/components/EventType";

type EventProps = {
    className?: string;
    event: EventType;
    mutation?: any;
}

function Event({className, event, mutation}: EventProps): JSX.Element {
    const handleDeleteEvent = async (id: number) => {
        const isDelete = confirm("Вы хотите удалить запись?");
        if (isDelete) {
            await mutation(id).unwrap();
        }
    }

    return (
        <div className={`${style.event} + ${className}`}>
            <div className={style.event_content}>
                <span className={style.title}>{event.title}</span>
                <span className={style.description}>{event.description}</span>
                <span className={style.departments}>{event.department}</span>
            </div>
            {
                mutation ? (
                    <div onClick={() => handleDeleteEvent(event.id)} className={style.delete_button}>
                        <img src={icon_trash} alt="Кнопка удалить"/>
                    </div>
                ) : null
            }
            <div className={style.time}>
                <div style={{textAlign: "center"}}>{event.time}</div>
                <div style={{textAlign: "center"}}>{convertDate(event.date)}</div>
            </div>
        </div>
    );
}

export default Event;
