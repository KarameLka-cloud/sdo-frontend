import { JSX, ReactNode } from "react";
import {
  Calendar,
  Building,
  ExternalLink,
  Timer,
  Clock,
  User,
  FileText,
  type LucideIcon,
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

type IconType = "calendar" | "timer" | "building" | "clock" | "user" | "file";

interface FieldConfig {
  icon: ReactNode;
  iconType: IconType;
  label: string;
  value: string | ReactNode;
  show: boolean;
}

const ICON_COLORS: Record<IconType, string> = {
  calendar: "bg-purple-50 text-purple-600",
  timer: "bg-amber-50 text-amber-600",
  building: "bg-emerald-50 text-emerald-600",
  clock: "bg-blue-50 text-blue-600",
  user: "bg-red-50 text-red-600",
  file: "bg-slate-50 text-slate-600",
};

function field(
  iconType: IconType,
  Icon: LucideIcon,
  label: string,
  value: string | ReactNode,
  show = true,
): FieldConfig {
  return {
    icon: <Icon className="h-3.5 w-3.5 shrink-0" />,
    iconType,
    label,
    value,
    show,
  };
}

function getFields(item: LearningItemType): FieldConfig[] {
  const departmentFields = [
    field(
      "building",
      Building,
      "Отдел:",
      item.department ?? "",
      hasTextValue(item.department),
    ),
    field(
      "file",
      FileText,
      "Примечание:",
      item.note_department ?? "",
      hasTextValue(item.note_department),
    ),
  ];

  const fieldsByType: Record<LearningItemType["type"], FieldConfig[]> = {
    course: [
      field("calendar", Calendar, "Пройти до:", convertDate(item.date)),
      field("timer", Timer, "Время прохождения:", `${item.duration} мин.`),
      ...departmentFields,
    ],
    event: [
      field("calendar", Calendar, "Дата:", convertDate(item.date)),
      field(
        "clock",
        Clock,
        "Время:",
        convertTime(item.time ?? ""),
        hasTextValue(item.time),
      ),
      field("timer", Timer, "Время прохождения:", `${item.duration} мин.`),
      ...departmentFields,
    ],
    webinar: [
      field("calendar", Calendar, "Дата:", convertDate(item.date)),
      field(
        "clock",
        Clock,
        "Время:",
        convertTime(item.time ?? ""),
        hasTextValue(item.time),
      ),
      field("timer", Timer, "Длительность:", `${item.duration} мин.`),
    ],
    test: [
      field("calendar", Calendar, "Пройти до:", convertDate(item.date)),
      field("timer", Timer, "Время прохождения:", `${item.duration} мин.`),
      field(
        "user",
        User,
        "Сотрудник:",
        item.position ?? "",
        hasTextValue(item.position),
      ),
      field(
        "file",
        FileText,
        "Примечание:",
        item.note_position ?? "",
        hasTextValue(item.note_position),
      ),
    ],
  };

  return fieldsByType[item.type].filter((itemField) => itemField.show);
}

function UniversalCard({ className, item }: UniversalCardProps): JSX.Element {
  const hasLink = hasTextValue(item.link);
  const fields = getFields(item);

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
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${ICON_COLORS[field.iconType]}`}
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
            <span>Перейти</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium mt-4 bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            <span>Перейти</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </button>
        )}
      </div>
    </div>
  );
}

export default UniversalCard;
