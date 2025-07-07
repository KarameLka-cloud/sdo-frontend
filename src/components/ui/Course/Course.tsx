import {JSX} from "react";
import style from "./Course.module.css";
import {CourseType} from "../../../types/components/CourseType.ts";

type CourseProps = {
    className?: string;
    course: CourseType,
    // mutation?: any,
}

function Course({className, course}: CourseProps): JSX.Element {
    return (
        <div className={`${style.course} + ${className}`} onClick={() => window.open(course.url, "_blank")}>
            <div className={style.title}>{course.title}</div>
            <div className={style.date_end}>{`Пройти до ${course.date_end}г.`}</div>
        </div>
    )
}

export default Course;
