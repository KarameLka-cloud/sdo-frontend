import {JSX} from "react";
import icon_trash from "../../../assets/images/icons/trash.svg";
import convertDate from "../../../utils/convertDate.ts";
import style from "./Course.module.css";
import {CourseType} from "../../../types/components/CourseType.ts";

type CourseProps = {
    className?: string;
    course: CourseType,
    mutation?: any,
}

function Course({className, course, mutation}: CourseProps): JSX.Element {
    const handleDeleteCourse = async (id: number) => {
        const isDelete = confirm("Вы хотите удалить запись?");
        if (isDelete) {
            await mutation(id).unwrap();
        }
    }

    return (
        <div className={`${style.course} + ${className}`}>
            <div className={style.content}>
                <div className={style.title} onClick={() => window.open(course.url, "_blank")}>{course.title}</div>
                {mutation ? <div className={style.url}>{course.url}</div> : null}
                <div className={style.date_end}>{`Пройти до ${convertDate(course.date_end)}г.`}</div>
            </div>
            {
                mutation ? (
                    <div onClick={() => handleDeleteCourse(course.id)} className={style.delete_button}>
                        <img src={icon_trash} alt="Кнопка удалить"/>
                    </div>
                ) : null
            }
        </div>
    )
}

export default Course;
