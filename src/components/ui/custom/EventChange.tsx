import { JSX } from "react";
import { EventType } from "@/interfaces/api/EventType.ts";
import convertDate from "@/utils/convertDate.ts";
import { useDelete } from "@/hooks/useDelete.ts";
import { convertTime } from "@/utils/convertTime.ts";
import IconButton from "./IconButton.tsx";

interface EventPropsType {
  className?: string;
  event: EventType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function EventChange({
  className,
  event,
  mutationDelete,
}: EventPropsType): JSX.Element {
  const handleDelete = useDelete(mutationDelete, "Удалить мероприятие?");

  return (
    <div
      className={`flex items-center p-4 rounded-2xl bg-white text-gray-900 font-semibold ${className || ""}`}
    >
      <div className="w-full mr-auto">
        <span className="text-base block">{event.title}</span>
        <span className="text-sm text-gray-500 block">{event.description}</span>
        {event.link && (
          <span className="text-sm text-gray-500 block break-all">
            {event.link}
          </span>
        )}
        <span className="italic text-sm text-gray-500 block">
          {event.department}{" "}
          {event.note_department && `(${event.note_department})`}
        </span>
        <span className="text-sm text-gray-900 block">
          {convertDate(event.date)}{" "}
          {event.time && `| ${convertTime(event.time)}`}
        </span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(event.id)}
        className="ml-2"
      />
    </div>
  );
}

export default EventChange;
