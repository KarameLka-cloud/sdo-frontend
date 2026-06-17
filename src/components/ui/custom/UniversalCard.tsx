import { JSX, ReactNode } from "react";
import {
  Calendar,
  Building,
  ExternalLink,
  Timer,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import convertDate from "@/utils/convertDate.ts";
import { convertTime } from "@/utils/convertTime.ts";
import { hasTextValue } from "@/utils/hasTextValue.ts";
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
  const link = "link" in item ? item.link : undefined;
  const hasLink = hasTextValue(link);

  const getFields = (): FieldConfig[] => {
    const fields: FieldConfig[] = [];

    switch (type) {
      case "course": {
        const course = item as CourseType;
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5" />,
            label: "Пройти до:",
            value: convertDate(course.date),
            show: true,
          },
          {
            icon: <Timer className="h-3.5 w-3.5" />,
            label: "Время прохождения:",
            value: `${course.duration} мин.`,
            show: true,
          },
          {
            icon: <Building className="h-3.5 w-3.5" />,
            label: "Отдел:",
            value: course.department,
            show: true,
          },
          {
            icon: <FileText className="h-3.5 w-3.5" />,
            label: "Примечание:",
            value: course.note_department!,
            show: hasTextValue(course.note_department),
          },
        );
        break;
      }

      case "event": {
        const event = item as EventType;
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5" />,
            label: "Дата:",
            value: convertDate(event.date),
            show: true,
          },
          {
            icon: <Clock className="h-3.5 w-3.5" />,
            label: "Время:",
            value: convertTime(event.time),
            show: hasTextValue(event.time),
          },
          {
            icon: <Timer className="h-3.5 w-3.5" />,
            label: "Время прохождения:",
            value: `${event.duration} мин.`,
            show: true,
          },
          {
            icon: <Building className="h-3.5 w-3.5" />,
            label: "Отдел:",
            value: event.department,
            show: true,
          },
          {
            icon: <FileText className="h-3.5 w-3.5" />,
            label: "Примечание:",
            value: event.note_department!,
            show: hasTextValue(event.note_department),
          },
        );
        break;
      }

      case "webinar": {
        const webinar = item as WebinarType;
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5" />,
            label: "Дата:",
            value: convertDate(webinar.date),
            show: true,
          },
          {
            icon: <Clock className="h-3.5 w-3.5" />,
            label: "Время:",
            value: convertTime(webinar.time),
            show: hasTextValue(webinar.time),
          },
          {
            icon: <Timer className="h-3.5 w-3.5" />,
            label: "Длительность:",
            value: `${webinar.duration} мин.`,
            show: true,
          },
        );
        break;
      }

      case "test": {
        const test = item as TestType;
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5" />,
            label: "Пройти до:",
            value: convertDate(test.date),
            show: true,
          },
          {
            icon: <Timer className="h-3.5 w-3.5" />,
            label: "Время прохождения:",
            value: `${test.duration} мин.`,
            show: true,
          },
          {
            icon: <User className="h-3.5 w-3.5" />,
            label: "Сотрудник:",
            value: test.position,
            show: true,
          },
          {
            icon: <FileText className="h-3.5 w-3.5" />,
            label: "Примечание:",
            value: test.note_position!,
            show: hasTextValue(test.note_position),
          },
        );
        break;
      }
    }

    return fields.filter((field) => field.show);
  };

  const fields = getFields();
  const description =
    type === "event" ? (item as EventType).description : undefined;

  const getIconColor = (iconType: string) => {
    const colors: Record<string, string> = {
      calendar: "bg-purple-50 text-purple-600",
      timer: "bg-amber-50 text-amber-600",
      building: "bg-emerald-50 text-emerald-600",
      clock: "bg-blue-50 text-blue-600",
      user: "bg-red-50 text-red-600",
      file: "bg-slate-50 text-slate-600",
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
      if (icon.type === FileText) return "file";
    }
    return "calendar";
  };

  return (
    <div
      className={`group flex flex-col md:flex-row items-stretch rounded-xl bg-white border border-gray-200 shadow-sm ${className}`}
    >
      <div className="p-4 w-2/3 flex flex-col justify-center gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {item.title}
        </h3>
        {hasTextValue(description) && (
          <p className="text-sm text-gray-600 leading-snug">{description}</p>
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

        {hasLink && (
          <a
            href={link!.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 mt-4 bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500 cursor-pointer"
          >
            <span>Ссылка</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        )}
      </div>
    </div>
  );
}

export default UniversalCard;
