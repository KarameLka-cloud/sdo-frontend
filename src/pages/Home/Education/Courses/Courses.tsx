import {JSX} from "react";
import styles from "./Courses.module.css";
import {CourseType} from "@interfaces/api/CourseType.ts";
import DataList from "@components/ui/DataList/DataList.tsx";
import CourseItem from "@components/ui/Course/Course.tsx";
import {useGetEducationCoursesQuery} from "@services/store/features/education.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Courses(): JSX.Element {
    const {data, error, isLoading} = useGetEducationCoursesQuery("");

    return (
        <OverflowScrollBlock header_name={'Электронные курсы'} button_back_visible={'enable'}>
            <DataList<CourseType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: CourseType) => (
                    <CourseItem key={item.id} course={item} className={styles.course}/>
                )}
            />

        </OverflowScrollBlock>
    )
}

export default Courses;
