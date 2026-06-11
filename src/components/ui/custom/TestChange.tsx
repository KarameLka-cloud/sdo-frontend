import { TestType } from "@/interfaces/api/TestType.ts";
import { useDelete } from "@/hooks/useDelete.ts";
import convertDate from "@/utils/convertDate.ts";
import { JSX } from "react";
import IconButton from "./IconButton.tsx";

interface TestPropsType {
  className?: string;
  test: TestType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function TestChange({
  className,
  test,
  mutationDelete,
}: TestPropsType): JSX.Element {
  const handleDelete = useDelete(mutationDelete, "Удалить тест?");

  return (
    <div
      className={`flex items-center p-4 rounded-2xl bg-white text-gray-900 font-semibold ${className || ""}`}
    >
      <div className="w-full mr-auto">
        <span className="text-base block">{test.title}</span>
        <span className="text-sm text-gray-500 block break-all">
          {test.url}
        </span>
        <span className="italic text-sm text-gray-500 block">
          {test.position} {test.note_position && `(${test.note_position})`}
        </span>
        <span className="text-sm text-gray-900 block">
          {convertDate(test.date_end)}
        </span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(test.id)}
        className="ml-2"
      />
    </div>
  );
}

export default TestChange;
