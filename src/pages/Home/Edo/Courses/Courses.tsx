import {JSX} from "react";
import style from "./Courses.module.css";
import {CourseType} from "../../../../types/components/CourseType.ts";
import CourseItem from "../../../../components/ui/Course/Course.tsx";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import {useGetEdoCoursesQuery} from "../../../../services/store/features/edoApi.ts";

function Courses(): JSX.Element {
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEdoCoursesQuery("");

    return (
        <>
            <HeaderPage>Электронные курсы</HeaderPage>
            <ButtonBack/>

            {courseError ? (
                <>Ошибка</>
            ) : courseLoading ? (
                <>Загрузка...</>
            ) : courseData && courseData.length > 0 ? (
                courseData.map((item: CourseType): JSX.Element => {
                    return (
                        <CourseItem key={item.id} course={item} className={style.course}/>
                    )
                })
            ) : (
                <div>Курсов нет</div>
            )}
        </>
    )
}

export default Courses;
