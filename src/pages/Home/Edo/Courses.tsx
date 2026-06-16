import { JSX } from "react";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import DataList from "@/components/ui/custom/DataList";
import { useGetEdoCoursesQuery } from "@/services/store/features/edo.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import UniversalCard from "@/components/ui/custom/UniversalCard";

function Courses(): JSX.Element {
  const { data, error, isLoading } = useGetEdoCoursesQuery("");

  return (
    <OverflowScrollBlock>
      <DataList<CourseType>
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: CourseType) => (
          <UniversalCard type="course" item={item} className="mt-4" />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Courses;
