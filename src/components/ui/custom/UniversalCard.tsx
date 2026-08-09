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
import { Separator } from "@/components/ui/shadcn/separator";
import convertDate from "@/utils/convertDate.ts";
import { convertTime } from "@/utils/convertTime.ts";
import { hasTextValue } from "@/utils/hasTextValue.ts";
import { LearningItemType } from "@/interfaces/api/LearningItemType.ts";

interface UniversalCardProps {
  className?: string;
  item: LearningItemType;
}

interface FieldConfig {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
  show: boolean;
}

function UniversalCard({ className, item }: UniversalCardProps): JSX.Element {
  const hasLink = hasTextValue(item.link);

  const getFields = (): FieldConfig[] => {
    const fields: FieldConfig[] = [];

    switch (item.type) {
      case "course":
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5 shrink-0" />,
            label: "Пройти до:",
            value: convertDate(item.date),
            show: true,
          },
          {
            icon: <Timer className="h-3.5 w-3.5 shrink-0" />,
            label: "Время прохождения:",
            value: `${item.duration} мин.`,
            show: true,
          },
          {
            icon: <Building className="h-3.5 w-3.5 shrink-0" />,
            label: "Отдел:",
            value: item.department ?? "",
            show: hasTextValue(item.department),
          },
          {
            icon: <FileText className="h-3.5 w-3.5 shrink-0" />,
            label: "Примечание:",
            value: item.note_department ?? "",
            show: hasTextValue(item.note_department),
          },
        );
        break;

      case "event":
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5 shrink-0" />,
            label: "Дата:",
            value: convertDate(item.date),
            show: true,
          },
          {
            icon: <Clock className="h-3.5 w-3.5 shrink-0" />,
            label: "Время:",
            value: convertTime(item.time ?? ""),
            show: hasTextValue(item.time),
          },
          {
            icon: <Timer className="h-3.5 w-3.5 shrink-0" />,
            label: "Время прохождения:",
            value: `${item.duration} мин.`,
            show: true,
          },
          {
            icon: <Building className="h-3.5 w-3.5 shrink-0" />,
            label: "Отдел:",
            value: item.department ?? "",
            show: hasTextValue(item.department),
          },
          {
            icon: <FileText className="h-3.5 w-3.5 shrink-0" />,
            label: "Примечание:",
            value: item.note_department ?? "",
            show: hasTextValue(item.note_department),
          },
        );
        break;

      case "webinar":
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5 shrink-0" />,
            label: "Дата:",
            value: convertDate(item.date),
            show: true,
          },
          {
            icon: <Clock className="h-3.5 w-3.5 shrink-0" />,
            label: "Время:",
            value: convertTime(item.time ?? ""),
            show: hasTextValue(item.time),
          },
          {
            icon: <Timer className="h-3.5 w-3.5 shrink-0" />,
            label: "Длительность:",
            value: `${item.duration} мин.`,
            show: true,
          },
        );
        break;

      case "test":
        fields.push(
          {
            icon: <Calendar className="h-3.5 w-3.5 shrink-0" />,
            label: "Пройти до:",
            value: convertDate(item.date),
            show: true,
          },
          {
            icon: <Timer className="h-3.5 w-3.5 shrink-0" />,
            label: "Время прохождения:",
            value: `${item.duration} мин.`,
            show: true,
          },
          {
            icon: <User className="h-3.5 w-3.5 shrink-0" />,
            label: "Сотрудник:",
            value: item.position ?? "",
            show: hasTextValue(item.position),
          },
          {
            icon: <FileText className="h-3.5 w-3.5 shrink-0" />,
            label: "Примечание:",
            value: item.note_position ?? "",
            show: hasTextValue(item.note_position),
          },
        );
        break;
    }

    return fields.filter((field) => field.show);
  };

  const fields = getFields();

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
        {hasTextValue(item.description) && (
          <p className="text-sm text-gray-600 leading-snug">
            {item.description}
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
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${getIconColor(
                  getIconType(field.icon),
                )}`}
              >
                {field.icon}
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="shrink-0 text-gray-500 text-xs uppercase tracking-wide font-medium leading-none">
                  {field.label}
                </span>
                <span className="min-w-0 font-medium text-gray-900 tabular-nums break-words leading-snug">
                  {field.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {hasLink ? (
          <a
            href={item.link!.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 mt-4 bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500 cursor-pointer"
          >
            <span>Ссылка</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium mt-4 bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            <span>Ссылка</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </button>
        )}
      </div>
    </div>
  );
}

export default UniversalCard;
