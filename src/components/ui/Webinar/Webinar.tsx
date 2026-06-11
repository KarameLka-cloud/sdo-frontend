import { JSX } from "react";
import convertDate from "@/utils/convertDate.ts";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import { convertTime } from "@/utils/convertTime.ts";

interface EventPropsType {
  className?: string;
  webinar: WebinarType;
}

function Webinar({ className, webinar }: EventPropsType): JSX.Element {
  return (
    <div
      className={`flex items-center justify-between py-1.5 px-4 rounded-2xl bg-white ${className || ""}`}
    >
      <div>
        <span className="block font-semibold">{webinar.title}</span>
      </div>
      <div className="ml-4 py-1.5 px-5 rounded-2xl bg-gray-50">
        <div className="text-center">
          {convertTime(webinar.time_start)}-{convertTime(webinar.time_end)}
        </div>
        <div className="text-center">{convertDate(webinar.date)}</div>
      </div>
    </div>
  );
}

export default Webinar;
