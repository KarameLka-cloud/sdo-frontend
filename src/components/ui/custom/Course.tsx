import { JSX } from "react";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import convertDate from "@/utils/convertDate.ts";
import { useDelete } from "@/hooks/useDelete.ts";
import IconButton from "./IconButton.tsx";

interface CoursePropsType {
  className?: string;
  course: CourseType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function CourseChange({
  className,
  course,
  mutationDelete,
}: CoursePropsType): JSX.Element {
  const handleDelete = useDelete(mutationDelete, "Удалить курс?");

  return (
    <div
      className={`flex items-center p-4 rounded-2xl bg-white text-gray-900 font-semibold ${className || ""}`}
    >
      <div className="w-full mr-auto">
        <span className="text-base block">{course.title}</span>
        <span className="text-sm text-gray-500 block break-all">
          {course.url}
        </span>
        <span className="italic text-sm text-gray-500 block">
          {course.department}{" "}
          {course.note_department && `(${course.note_department})`}
        </span>
        <span className="text-sm text-gray-900 block">
          {convertDate(course.date_end)}
        </span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(course.id)}
        className="ml-2"
      />
    </div>
  );
}

export default CourseChange;
