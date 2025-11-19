import {JSX} from "react";
import styles from "./Course.module.css";
import convertDate from "@utils/convertDate.ts";
import {CourseType} from "@interfaces/api/CourseType.ts";

interface CoursePropsType {
    className?: string;
    course: CourseType;
}

function Course({className, course}: CoursePropsType): JSX.Element {
    return (
        <div className={`${styles.course} ${className}`} onClick={() => window.open(course.url, "_blank")}>
            <span className={styles.title}>{course.title}</span>
            <span
                className={styles.department}>{course.department} {course.note_department && `(${course.note_department})`}
                </span>
            <span className={styles.date_end}>{`Пройти до ${convertDate(course.date_end)}г.`}</span>
        </div>
    )
}

export default Course;
