import {JSX} from "react";
import style from "./Courses.module.css";
import {CourseType} from "../../../../interfaces/api/CourseType.ts";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import DataList from "../../../../components/ui/DataList/DataList.tsx";
import CourseItem from "../../../../components/ui/Course/Course.tsx";
import {useGetEdoCoursesQuery} from "../../../../services/store/features/edo.ts";

function Courses(): JSX.Element {
    const {data, error, isLoading} = useGetEdoCoursesQuery("");

    return (
        <>
            <HeaderPage>Электронные курсы</HeaderPage>
            <ButtonBack/>

            <DataList<CourseType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: CourseType) => (
                    <CourseItem key={item.id} course={item} className={style.course}/>
                )}
            />
        </>
    )
}

export default Courses;
