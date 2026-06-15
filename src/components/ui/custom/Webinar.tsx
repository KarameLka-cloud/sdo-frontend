import { JSX } from "react";
import convertDate from "@/utils/convertDate.ts";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import { convertTime } from "@/utils/convertTime.ts";
import { Calendar, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EventPropsType {
  className?: string;
  webinar: WebinarType;
}

function Webinar({ className, webinar }: EventPropsType): JSX.Element {
  return (
    <div
      className={`group flex flex-col md:flex-row items-stretch rounded-xl bg-white border border-gray-200 shadow-sm ${className}`}
    >
      <div className="p-4 w-2/3 flex flex-col justify-center">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {webinar.title}
        </h3>
      </div>

      <Separator
        orientation="vertical"
        className="bg-gray-200 hidden md:block"
      />

      <div className="w-1/3 p-4 flex flex-col">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-50 text-purple-60l0">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
              Дата:
            </span>
            <span className="font-medium text-gray-900 tabular-nums">
              {convertDate(webinar.date)}
            </span>
          </div>

          {webinar.time_start && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                Время:
              </span>
              <span className="font-medium text-gray-900 tabular-nums">
                {`${convertTime(webinar.time_start)} - ${convertTime(webinar.time_end)}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Webinar;
