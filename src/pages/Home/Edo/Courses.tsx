import { JSX } from "react";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import DataList from "@/components/ui/custom/DataList";
import { useGetEdoCoursesQuery } from "@/services/store/features/edo.ts";
import UniversalCard from "@/components/ui/custom/UniversalCard";

function Courses(): JSX.Element {
  const { data, error, isLoading } = useGetEdoCoursesQuery("");

  return (
    <DataList<CourseType>
      data={data}
      error={!!error}
      isLoading={isLoading}
      renderItem={(item: CourseType) => (
        <UniversalCard type="course" item={item} className="mt-4" />
      )}
    />
  );
}

export default Courses;
