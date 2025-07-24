import {JSX} from "react";
import style from "./Courses.module.css";
import {CourseType} from "../../../../types/components/CourseType.ts";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import NoData from "../../../../components/ui/NoData/NoData.tsx";
import CourseItem from "../../../../components/ui/Course/Course.tsx";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import {useGetEdoCoursesQuery} from "../../../../services/store/features/edo.ts";

function Courses(): JSX.Element {
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEdoCoursesQuery("");

    return (
        <>
            <HeaderPage>Электронные курсы</HeaderPage>
            <ButtonBack/>

            {courseError ? (
                <ErrorData/>
            ) : courseLoading ? (
                <Loader/>
            ) : courseData && courseData.length > 0 ? (
                courseData.map((item: CourseType): JSX.Element => {
                    return (
                        <CourseItem key={item.id} course={item} className={style.course}/>
                    )
                })
            ) : (
                <NoData>Курсов нет</NoData>
            )}
        </>
    )
}

export default Courses;
