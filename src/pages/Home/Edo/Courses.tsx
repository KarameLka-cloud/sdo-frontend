import { JSX } from "react";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import DataList from "@/components/ui/custom/DataList";
import CourseItem from "@/components/ui/custom/Course";
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
          <CourseItem key={item.id} course={item} className="mt-4" />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Courses;
