import { JSX } from "react";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import DataList from "@/components/ui/custom/DataList";
import { useGetEducationCoursesQuery } from "@/services/store/features/education.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import UniversalCard from "@/components/ui/custom/UniversalCard";

function Courses(): JSX.Element {
  const { data, error, isLoading } = useGetEducationCoursesQuery("");

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
