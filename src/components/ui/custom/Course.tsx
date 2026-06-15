import { JSX } from "react";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import convertDate from "@/utils/convertDate.ts";
import { Calendar, Building, ExternalLink, Timer } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CoursePropsType {
  className?: string;
  course: CourseType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
}

function CourseChange({ className, course }: CoursePropsType): JSX.Element {
  const hasLink = Boolean(course.url);

  return (
    <div
      className={`group flex flex-col md:flex-row items-stretch rounded-xl bg-white border border-gray-200 shadow-sm ${className}`}
    >
      <div className="p-4 w-2/3 flex flex-col justify-center">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {course.title}
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
              Пройти до:
            </span>
            <span className="font-medium text-gray-900 tabular-nums">
              {convertDate(course.date_end)}
            </span>
          </div>

          {course.date_end && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                <Timer className="h-3.5 w-3.5" />
              </div>
              <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                Время прохождения:
              </span>
              <span className="font-medium text-gray-900 tabular-nums">
                ~ мин.
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
              <Building className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1">
              <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                Отдел:{" "}
                <span
                  className={`font-medium tabular-nums ${course.note_department ? "text-gray-400" : "text-gray-900"}`}
                >
                  {course.department}
                  {course.note_department && (
                    <span className="text-gray-900 ml-1">
                      ({course.note_department})
                    </span>
                  )}
                </span>
              </span>
            </div>
          </div>
        </div>

        {hasLink ? (
          <a
            href={course.url}
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

export default CourseChange;
