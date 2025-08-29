import {JSX} from "react";
import style from "./CourseChange.module.css";
import {CourseType} from "../../../types/api/CourseType.ts";
import convertDate from "../../../utils/convertDate.ts";
import InputText from "../InputText/InputText.tsx";
import InputDate from "../InputDate/InputDate.tsx";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useDelete} from "../../../hooks/useDelete.ts";
import ButtonDelete from "../ButtonDelete/ButtonDelete.tsx";
import ButtonEdit from "../ButtonEdit/ButtonEdit.tsx";
import ButtonSave from "../ButtonSave/ButtonSave.tsx";
import ButtonClose from "../ButtonClose/ButtonClose.tsx";
import {useUpdate} from "../../../hooks/useUpdate.ts";

type CoursePropsType = {
    className?: string;
    course: CourseType;
    mutationUpdate: any;
    mutationDelete: any;
}

function CourseChange({className, course, mutationUpdate, mutationDelete}: CoursePropsType): JSX.Element {
    const {formItems, handleChange} = useForm({
        title: course.title,
        url: course.url,
        date_end: course.date_end,
    });
    const {value: edit, toggle: handleEdit} = useToggle();
    const handleUpdate = useUpdate(mutationUpdate, "Обновить курс?");
    const handleDelete = useDelete(mutationDelete, "Удалить курс?");

    return (
        <div className={`${style.course} ${className}`}>
            {edit ?
                <div className={style.form}>
                    <InputText type="text" name="title" value={formItems.title} onChange={handleChange}
                               className={style.input}/>
                    <InputText type="text" name="url" value={formItems.url} onChange={handleChange}
                               className={style.input}/>
                    <InputDate type="date" name="date_end" value={formItems.date_end} onChange={handleChange}
                               className={style.input}/>
                </div> :
                <div className={style.content}>
                    <div className={style.title}>{course.title}</div>
                    <div className={style.url}>{course.url}</div>
                    <div className={style.date_end}>{convertDate(course.date_end)}</div>
                </div>
            }
            {edit &&
                <ButtonSave onClick={() => handleUpdate({id: course.id, ...formItems})} className={style.button_save}/>}
            {edit ? <ButtonClose onClick={handleEdit} className={style.button_close}/> :
                <ButtonEdit onClick={handleEdit} className={style.button_edit}/>}
            {!edit && <ButtonDelete onClick={() => handleDelete(course.id)} className={style.button_delete}/>}
        </div>
    )
}

export default CourseChange;
