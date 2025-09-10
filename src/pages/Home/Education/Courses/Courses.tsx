import {JSX} from "react";
import styles from "./Courses.module.css";
import {CourseType} from "../../../../interfaces/api/CourseType.ts";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import DataList from "../../../../components/ui/DataList/DataList.tsx";
import CourseItem from "../../../../components/ui/Course/Course.tsx";
import {useGetEducationCoursesQuery} from "../../../../services/store/features/education.ts";

function Courses(): JSX.Element {
    const {data, error, isLoading} = useGetEducationCoursesQuery("");

    return (
        <>
            <HeaderPage>Электронные курсы</HeaderPage>
            <ButtonBack/>

            <DataList<CourseType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: CourseType) => (
                    <CourseItem key={item.id} course={item} className={styles.course}/>
                )}
            />
        </>
    )
}

export default Courses;
