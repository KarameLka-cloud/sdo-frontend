import {JSX} from "react";
import style from "./Course.module.css";
import convertDate from "../../../utils/convertDate.ts";
import {CourseType} from "../../../types/api/CourseType.ts";

type CoursePropsType = {
    className?: string;
    course: CourseType;
}

function Course({className, course}: CoursePropsType): JSX.Element {
    return (
        <div className={`${style.course} + ${className}`} onClick={() => window.open(course.url, "_blank")}>
            <div className={style.content}>
                <div className={style.title}>{course.title}</div>
                <div className={style.date_end}>{`Пройти до ${convertDate(course.date_end)}г.`}</div>
            </div>
        </div>
    )
}

export default Course;
