import { JSX } from "react";
import styles from "./Courses.module.css";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import DataList from "@/components/ui/DataList/DataList";
import CourseItem from "@/components/ui/Course/Course";
import { useGetEdoCoursesQuery } from "@/services/store/features/edo.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";

function Courses(): JSX.Element {
  const { data, error, isLoading } = useGetEdoCoursesQuery("");

  return (
    <OverflowScrollBlock>
      <DataList<CourseType>
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: CourseType) => (
          <CourseItem key={item.id} course={item} className={styles.course} />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Courses;
