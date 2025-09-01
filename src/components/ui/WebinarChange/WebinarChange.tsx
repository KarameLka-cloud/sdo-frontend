import {JSX} from "react";
import style from "./WebinarChange.module.css";
import InputText from "../InputText/InputText.tsx";
import InputDate from "../InputDate/InputDate.tsx";
import InputTime from "../InputTime/InputTime.tsx";
import ButtonEdit from "../ButtonEdit/ButtonEdit.tsx";
import ButtonSave from "../ButtonSave/ButtonSave.tsx";
import ButtonClose from "../ButtonClose/ButtonClose.tsx";
import ButtonDelete from "../ButtonDelete/ButtonDelete.tsx";
import {WebinarType} from "../../../types/api/WebinarType.ts";
import convertDate from "../../../utils/convertDate.ts";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useUpdate} from "../../../hooks/useUpdate.ts";
import {useDelete} from "../../../hooks/useDelete.ts";
import {convertTime} from "../../../utils/convertTime.ts";

type EventPropsType = {
    className?: string;
    webinar: WebinarType;
    mutationDelete?: any;
    mutationUpdate?: any;
}

function WebinarChange({className, webinar, mutationDelete, mutationUpdate}: EventPropsType): JSX.Element {
    const {formItems, handleChange} = useForm({
        title: webinar.title,
        time_start: webinar.time_start,
        time_end: webinar.time_end,
        date: webinar.date,
    });
    const {value: edit, toggle: handleEdit} = useToggle();
    const handleUpdate = useUpdate(mutationUpdate, "Обновить вебинар?");
    const handleDelete = useDelete(mutationDelete, "Удалить вебинар?");

    return (
        <div className={`${style.webinar} ${className}`}>
            {edit ?
                <div className={style.form}>
                    <InputText type="text" name="title" value={formItems.title} onChange={handleChange}
                               className={style.input}/>
                    <div>
                        <InputDate type="date" name="date" value={formItems.date} onChange={handleChange}/>
                        <InputTime type="time" name="time_start" value={formItems.time_start} onChange={handleChange}/>
                        <InputTime type="time" name="time_end" value={formItems.time_end} onChange={handleChange}/>
                    </div>
                </div> :
                <div className={style.content}>
                    <div className={style.title}>{webinar.title}</div>
                    <div
                        className={style.date_time}>{`${convertDate(webinar.date)} | ${convertTime(webinar.time_start)}-${convertTime(webinar.time_end)}`}
                    </div>
                </div>
            }
            {edit ? <>
                    <ButtonSave onClick={() => handleUpdate({id: webinar.id, ...formItems})} className={style.button_save}/>
                    <ButtonClose onClick={handleEdit} className={style.button_close}/>
                </> :
                <ButtonEdit onClick={handleEdit} className={style.button_edit}/>
            }
            {!edit && <ButtonDelete onClick={() => handleDelete(webinar.id)} className={style.button_delete}/>}
        </div>
    )
}

export default WebinarChange;
