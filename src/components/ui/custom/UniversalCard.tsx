import { JSX, ReactNode } from "react";
import {
  Calendar,
  Building,
  ExternalLink,
  Timer,
  Clock,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import convertDate from "@/utils/convertDate.ts";
import { convertTime } from "@/utils/convertTime.ts";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import { EventType } from "@/interfaces/api/EventType.ts";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import { TestType } from "@/interfaces/api/TestType.ts";

type UniversalItem = CourseType | EventType | WebinarType | TestType;

interface UniversalCardProps {
  className?: string;
  item: UniversalItem;
  type: "course" | "event" | "webinar" | "test";
}

interface FieldConfig {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
  show: boolean;
}

function UniversalCard({
  className,
  item,
  type,
}: UniversalCardProps): JSX.Element {
  const hasLink =
    ("url" in item && Boolean(item.url)) ||
    ("link" in item && Boolean(item.link));

  const getLink = () => {
    if ("url" in item && item.url) return item.url;
    if ("link" in item && item.link) return item.link;
    return null;
  };

  const getFields = (): FieldConfig[] => {
    const fields: FieldConfig[] = [];

    switch (type) {
      case "course":
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5" />,
            label: "Пройти до:",
            value: convertDate((item as CourseType).date_end),
            show: true,
          },
          {
            icon: <Timer className="h-3.5 w-3.5" />,
            label: "Время прохождения:",
            value: "~ мин.",
            show: true,
          },
          {
            icon: <Building className="h-3.5 w-3.5" />,
            label: "Отдел:",
            value: (
              <>
                {(item as CourseType).department}
                {(item as CourseType).note_department && (
                  <span className="text-gray-900 ml-1">
                    ({(item as CourseType).note_department})
                  </span>
                )}
              </>
            ),
            show: true,
          },
        );
        break;

      case "event":
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5" />,
            label: "Дата:",
            value: convertDate((item as EventType).date),
            show: true,
          },
          {
            icon: <Clock className="h-3.5 w-3.5" />,
            label: "Время:",
            value: convertTime((item as EventType).time || ""),
            show: Boolean((item as EventType).time),
          },
          {
            icon: <Timer className="h-3.5 w-3.5" />,
            label: "Время прохождения:",
            value: "~ мин.",
            show: true,
          },
          {
            icon: <Building className="h-3.5 w-3.5" />,
            label: "Отдел:",
            value: (
              <>
                {(item as EventType).department}
                {(item as EventType).note_department && (
                  <span className="text-gray-900 ml-1">
                    ({(item as EventType).note_department})
                  </span>
                )}
              </>
            ),
            show: true,
          },
        );
        break;

      case "webinar":
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5" />,
            label: "Дата:",
            value: convertDate((item as WebinarType).date),
            show: true,
          },
          {
            icon: <Clock className="h-3.5 w-3.5" />,
            label: "Время:",
            value: `${convertTime((item as WebinarType).time_start)} - ${convertTime((item as WebinarType).time_end)}`,
            show: Boolean((item as WebinarType).time_start),
          },
        );
        break;

      case "test":
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5" />,
            label: "Пройти до:",
            value: convertDate((item as TestType).date_end),
            show: true,
          },
          {
            icon: <Timer className="h-3.5 w-3.5" />,
            label: "Время прохождения:",
            value: "~ мин.",
            show: true,
          },
          {
            icon: <User className="h-3.5 w-3.5" />,
            label: "Сотрудник:",
            value: (
              <>
                {(item as TestType).position}
                {(item as TestType).note_position && (
                  <span className="text-gray-900 ml-1">
                    ({(item as TestType).note_position})
                  </span>
                )}
              </>
            ),
            show: true,
          },
        );
        break;
    }

    return fields.filter((field) => field.show);
  };

  const fields = getFields();
  const hasDescription =
    "description" in item && (item as EventType).description;

  const getIconColor = (iconType: string) => {
    const colors: Record<string, string> = {
      calendar: "bg-purple-50 text-purple-600",
      timer: "bg-amber-50 text-amber-600",
      building: "bg-emerald-50 text-emerald-600",
      clock: "bg-blue-50 text-blue-600",
      user: "bg-red-50 text-red-600",
    };
    return colors[iconType] || "bg-gray-50 text-gray-600";
  };

  const getIconType = (icon: ReactNode): string => {
    if (icon && typeof icon === "object" && "type" in icon) {
      if (icon.type === Calendar) return "calendar";
      if (icon.type === Timer) return "timer";
      if (icon.type === Building) return "building";
      if (icon.type === Clock) return "clock";
      if (icon.type === User) return "user";
    }
    return "calendar";
  };

  return (
    <div
      className={`group flex flex-col md:flex-row items-stretch rounded-xl bg-white border border-gray-200 shadow-sm ${className}`}
    >
      <div className="p-4 w-2/3 flex flex-col justify-center">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {item.title}
        </h3>
        {hasDescription && (
          <p className="text-gray-500 text-sm mt-6 leading-relaxed">
            {(item as EventType).description}
          </p>
        )}
      </div>

      <Separator
        orientation="vertical"
        className="bg-gray-200 hidden md:block"
      />

      <div className="w-1/3 p-4 flex flex-col">
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-md ${getIconColor(
                  getIconType(field.icon),
                )}`}
              >
                {field.icon}
              </div>
              <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                {field.label}
              </span>
              <span className="font-medium text-gray-900 tabular-nums">
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {hasLink ? (
          <a
            href={getLink() || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 mt-4 bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500 cursor-pointer"
          >
            <span>Ссылка</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        ) : (
          <div className="mt-4 px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-400 rounded-lg text-center">
            Ссылка отсутствует
          </div>
        )}
      </div>
    </div>
  );
}

export default UniversalCard;
