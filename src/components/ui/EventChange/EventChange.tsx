import {JSX} from "react";
import style from "./EventChange.module.css";
import InputText from "../InputText/InputText.tsx";
import InputDate from "../InputDate/InputDate.tsx";
import InputTime from "../InputTime/InputTime.tsx";
import {EventType} from "../../../interfaces/api/EventType.ts";
import convertDate from "../../../utils/convertDate.ts";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useUpdate} from "../../../hooks/useUpdate.ts";
import {useDelete} from "../../../hooks/useDelete.ts";
import {convertTime} from "../../../utils/convertTime.ts";
import IconButton from "../IconButton/IconButton.tsx";

interface EventPropsType {
    className?: string;
    event: EventType;
    mutationDelete?: any;
    mutationUpdate?: any;
}

function EventChange({className, event, mutationDelete, mutationUpdate}: EventPropsType): JSX.Element {
    const {formItems, handleChange} = useForm({
        title: event.title,
        description: event.description,
        department: event.department,
        date: event.date,
        time: event.time,
    });
    const {value: edit, toggle: handleEdit} = useToggle();
    const handleUpdate = useUpdate(mutationUpdate, "Обновить мероприятие?");
    const handleDelete = useDelete(mutationDelete, "Удалить мероприятие?");

    return (
        <div className={`${style.event} ${className}`}>
            {edit ?
                <div className={style.form}>
                    <InputText type="text" name="title" value={formItems.title} onChange={handleChange}
                               className={style.input}/>
                    <InputText type="text" name="description" value={formItems.description} onChange={handleChange}
                               className={style.input}/>
                    <InputText type="text" name="department" value={formItems.department} onChange={handleChange}
                               className={style.input}/>
                    <div>
                        <InputDate type="date" name="date" value={formItems.date} onChange={handleChange}/>
                        <InputTime type="time" name="time" value={formItems.time} onChange={handleChange}/>
                    </div>
                </div> :
                <div className={style.content}>
                    <div className={style.title}>{event.title}</div>
                    <div className={style.description}>{event.description}</div>
                    <div className={style.department}>{event.department}</div>
                    <div className={style.date_time}>{`${convertDate(event.date)} | ${convertTime(event.time)}`}</div>
                </div>
            }
            {edit ? <>
                    <IconButton type={"save"} onClick={() => handleUpdate({id: event.id, ...formItems})}
                                className={style.button_save}/>
                    <IconButton type={"close"} onClick={handleEdit} className={style.button_close}/>
                </> :
                <IconButton type={"edit"} onClick={handleEdit} className={style.button_edit}/>
            }
            {!edit &&
                <IconButton type={"delete"} onClick={() => handleDelete(event.id)} className={style.button_delete}/>}
        </div>
    )
}

export default EventChange;
