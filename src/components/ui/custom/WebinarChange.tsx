import { JSX } from "react";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import convertDate from "@/utils/convertDate.ts";
import { useDelete } from "@/hooks/useDelete.ts";
import { convertTime } from "@/utils/convertTime.ts";
import IconButton from "./IconButton.tsx";

interface EventPropsType {
  className?: string;
  webinar: WebinarType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function WebinarChange({
  className,
  webinar,
  mutationDelete,
}: EventPropsType): JSX.Element {
  const handleDelete = useDelete(mutationDelete, "Удалить вебинар?");

  return (
    <div
      className={`flex items-center p-4 rounded-2xl bg-white text-gray-900 font-semibold ${className || ""}`}
    >
      <div className="w-full mr-auto">
        <span className="text-base block">{webinar.title}</span>
        <span className="text-sm text-gray-900 block">
          {`${convertDate(webinar.date)} | ${convertTime(webinar.time_start)}-${convertTime(webinar.time_end)}`}
        </span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(webinar.id)}
        className="ml-2"
      />
    </div>
  );
}

export default WebinarChange;
