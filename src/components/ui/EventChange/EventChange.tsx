import {JSX} from "react";
import style from "./EventChange.module.css";
import InputText from "../InputText/InputText.tsx";
import InputDate from "../InputDate/InputDate.tsx";
import InputTime from "../InputTime/InputTime.tsx";
import ButtonEdit from "../ButtonEdit/ButtonEdit.tsx";
import ButtonDelete from "../ButtonDelete/ButtonDelete.tsx";
import {EventType} from "../../../types/components/EventType.ts";
import convertDate from "../../../utils/convertDate.ts";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useDelete} from "../../../hooks/useDelete.ts";

type EventProps = {
    className?: string;
    event: EventType;
    mutation: any;
}

function EventChange({className, event, mutation}: EventProps): JSX.Element {
    const {formItems, handleChange} = useForm({
        title: event.title,
        description: event.description,
        department: event.department,
        date: event.date,
        time: event.time,
    });
    const {value: edit, toggle: handleEdit} = useToggle();
    const handleDelete = useDelete(mutation, "Удалить Мероприятие?");

    return (
        <div className={`${style.event} ${className}`}>
            {edit ?
                <div className={style.content}>
                    <InputText type="text" name="title" value={formItems.title} onChange={handleChange}/>
                    <InputText type="text" name="description" value={formItems.description} onChange={handleChange}/>
                    <InputText type="text" name="department" value={formItems.department} onChange={handleChange}/>
                    <InputDate type="date" name="date" value={formItems.date} onChange={handleChange}/>
                    <InputTime type="time" name="time" value={formItems.time} onChange={handleChange}/>
                </div> :
                <div className={style.content}>
                    <div className={style.title}>{event.title}</div>
                    <div className={style.description}>{event.description}</div>
                    <div className={style.department}>{event.department}</div>
                    <div className={style.date}>{convertDate(event.date)}</div>
                    <div className={style.time}>{event.time}</div>
                </div>
            }
            {edit && <ButtonDelete onClick={() => handleDelete(event.id)}/>}
            <ButtonEdit onClick={handleEdit} className={style.button_edit}/>
        </div>
    )
}

export default EventChange;
