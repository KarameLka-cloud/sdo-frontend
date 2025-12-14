import {JSX} from "react";
import styles from "./CourseChange.module.css";
import {CourseType} from "@interfaces/api/CourseType.ts";
import convertDate from "@utils/convertDate.ts";
// import {useForm} from "@hooks/useForm.ts";
// import {useToggle} from "@hooks/useToggle.ts";
import {useDelete} from "@hooks/useDelete.ts";
// import {useUpdate} from "@hooks/useUpdate.ts";
// import Input from "../Input/Input.tsx";
import IconButton from "../IconButton/IconButton.tsx";

interface CoursePropsType {
    className?: string;
    course: CourseType;
    mutationDelete: any;
    // mutationUpdate: any;
}

function CourseChange({className, course, mutationDelete}: CoursePropsType): JSX.Element {
    // const {formItems, handleChange} = useForm({
    //     title: course.title,
    //     url: course.url,
    //     date_end: course.date_end,
    // });
    // const {value: edit, toggle: handleEdit} = useToggle();
    // const handleUpdate = useUpdate(mutationUpdate, "Обновить курс?");
    const handleDelete = useDelete(mutationDelete, "Удалить курс?");

    return (
        <div className={`${styles.course} ${className}`}>
            <div className={styles.content}>
                <span className={styles.title}>{course.title}</span>
                <span className={styles.url}>{course.url}</span>
                <span
                    className={styles.department}>{course.department} {course.note_department && `(${course.note_department})`}</span>
                <span className={styles.date_end}>{convertDate(course.date_end)}</span>
            </div>
            <IconButton type={"delete"} onClick={() => handleDelete(course.id)} className={styles.button_delete}/>

            {/*{edit ?*/}
            {/*    <div className={styles.form}>*/}
            {/*        <Input type="text" name="title" value={formItems.title} onChange={handleChange}*/}
            {/*               className={styles.input}/>*/}
            {/*        <Input type="text" name="url" value={formItems.url} onChange={handleChange}*/}
            {/*               className={styles.input}/>*/}
            {/*        <Input type="date" name="date_end" value={formItems.date_end} onChange={handleChange}*/}
            {/*               className={styles.input}/>*/}
            {/*    </div> :*/}
            {/*    <div className={styles.content}>*/}
            {/*        <span className={styles.title}>{course.title}</span>*/}
            {/*        <span className={styles.url}>{course.url}</span>*/}
            {/*        <span className={styles.date_end}>{convertDate(course.date_end)}</span>*/}
            {/*    </div>*/}
            {/*}*/}
            {/*{edit ? <>*/}
            {/*        <IconButton type={"save"} onClick={() => handleUpdate({id: course.id, ...formItems})}*/}
            {/*                    className={styles.button_save}/>*/}
            {/*        <IconButton type={"close"} onClick={handleEdit} className={styles.button_close}/>*/}
            {/*    </> :*/}
            {/*    <IconButton type={"edit"} onClick={handleEdit} className={styles.button_edit}/>*/}
            {/*}*/}
            {/*{!edit &&*/}
            {/*    <IconButton type={"delete"} onClick={() => handleDelete(course.id)} className={styles.button_delete}/>}*/}
        </div>
    )
}

export default CourseChange;
