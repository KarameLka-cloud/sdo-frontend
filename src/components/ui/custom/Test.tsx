import { JSX } from "react";
import convertDate from "@/utils/convertDate.ts";
import { TestType } from "@/interfaces/api/TestType.ts";

interface TestPropsType {
  className?: string;
  test: TestType;
}

function Test({ className, test }: TestPropsType): JSX.Element {
  return (
    <div
      className={`flex flex-col p-4 rounded-2xl bg-white text-gray-900 scale-100 transition-transform duration-200 ease-in-out cursor-pointer hover:scale-105 ${className || ""}`}
      onClick={() => window.open(test.url, "_blank")}
    >
      <span className="block font-semibold">{test.title}</span>
      <span className="block italic">
        {test.position} {test.note_position && `(${test.note_position})`}
      </span>
      <span className="block pt-1.5 mt-1.5 border-t border-gray-800 text-gray-500 text-sm">
        {`Пройти до ${convertDate(test.date_end)}г.`}
      </span>
    </div>
  );
}

export default Test;
