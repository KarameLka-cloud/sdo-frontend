import {JSX} from "react";
import convertDate from "../../../utils/convertDate.ts";
import style from "./CourseChange.module.css";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useDelete} from "../../../hooks/useDelete.ts";
import {TestType} from "../../../types/components/TestType.ts";
import ButtonDelete from "../ButtonDelete/ButtonDelete.tsx";
import ButtonEdit from "../ButtonEdit/ButtonEdit.tsx";

type CourseProps = {
    className?: string;
    course: TestType;
    mutation: any;
}

function CourseChange({className, course, mutation}: CourseProps): JSX.Element {
    const {formItems, handleChange} = useForm({
        title: course.title,
        url: course.url,
        date_end: course.date_end,
    });
    const {value: edit, toggle: handleEdit} = useToggle();
    const handleDelete = useDelete(mutation, "Удалить курс?");

    return (
        <div className={`${style.course} ${className}`}>
            {edit ?
                <div className={style.content}>
                    <input type="text" name="title" value={formItems.title} onChange={handleChange}/>
                    <input type="text" name="url" value={formItems.url} onChange={handleChange}/>
                    <input type="date" name="date_end" value={formItems.date_end} onChange={handleChange}/>
                </div> :
                <div className={style.content}>
                    <div className={style.title}>{course.title}</div>
                    <div className={style.url}>{course.url}</div>
                    <div className={style.date_end}>{convertDate(course.date_end)}</div>
                </div>
            }
            {edit && <ButtonDelete onClick={() => handleDelete(course.id)}/>}
            <ButtonEdit onClick={handleEdit} className={style.button_edit}/>
        </div>
    )
}

export default CourseChange;
