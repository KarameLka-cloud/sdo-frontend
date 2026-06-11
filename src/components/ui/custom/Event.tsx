import { JSX } from "react";
import convertDate from "@/utils/convertDate.ts";
import { EventType } from "@/interfaces/api/EventType.ts";
import { convertTime } from "@/utils/convertTime.ts";
import icon_link from "@/assets/images/icons/link.svg";

interface EventPropsType {
  className?: string;
  event: EventType;
}

function Event({ className, event }: EventPropsType): JSX.Element {
  return (
    <div
      className={`flex items-center justify-between py-1.5 px-4 rounded-2xl bg-white ${className || ""}`}
    >
      <div>
        <span className="block font-semibold">{event.title}</span>
        <span className="block text-gray-500">{event.description}</span>
        <span className="block italic">
          {event.department}{" "}
          {event.note_department && `(${event.note_department})`}
        </span>
      </div>

      <div className="flex items-center ml-auto">
        {event.link && (
          <img
            src={icon_link}
            onClick={() => window.open(event.link, "_blank")}
            alt={"Ссылка"}
            className="h-5.5 cursor-pointer"
          />
        )}
      </div>

      <div className="py-1.5 px-5 ml-4 rounded-2xl bg-gray-50">
        {event.time && (
          <span className="block text-center">{convertTime(event.time)}</span>
        )}
        <span className="block text-center">{convertDate(event.date)}</span>
      </div>
    </div>
  );
}

export default Event;
