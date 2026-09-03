import { JSX, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type {
  AdaptationPlanDayType,
  TaskStatus,
} from "@/interfaces/api/AdaptationPlanType.ts";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcn/collapsible";
import { Field, FieldLabel } from "@/components/ui/shadcn/field";
import ReadonlyFieldValue from "@/components/ui/custom/ReadonlyFieldValue";
import TaskItem from "@/components/ui/custom/TaskItem";
import CommentFieldWithSave from "@/pages/Mentorship/Interns/plan-editor/CommentFieldWithSave";
import {
  capitalizeFirst,
  COMPLETION_CHIP_CLASS,
  COMPLETION_VALUE_CLASS,
  DAY_META_CHIP_CLASS,
} from "@/components/adaptation/dayCardMeta";
import { cn } from "@/lib/utils";
import convertDate from "@/utils/convertDate.ts";
import { formatDayRange, isDaySpan } from "@/utils/formatDayRange.ts";

const READONLY_COMMENT_FIELDS = [
  { key: "mentor_comment", label: "Комментарий наставника" },
  { key: "department_head_comment", label: "Комментарий руководителя" },
] as const;

interface CareerDayProps {
  day: AdaptationPlanDayType;
  onUpdateInternComment?: (
    dayId: number | undefined,
    comment: string,
  ) => Promise<void> | void;
  onUpdateTaskStatus?: (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ) => Promise<void> | void;
}

function MetaPair({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}): JSX.Element {
  return (
    <div className="flex min-w-0 items-baseline gap-2">
      <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "m-0 min-w-0 text-sm font-medium wrap-break-word",
          valueClassName,
        )}
      >
        {value || "—"}
      </dd>
    </div>
  );
}

function CareerDay({
  day,
  onUpdateInternComment,
  onUpdateTaskStatus,
}: CareerDayProps): JSX.Element {
  const savedInternComment = day.intern_comment ?? "";
  const [internComment, setInternComment] = useState(savedInternComment);
  const [isSavingComment, setIsSavingComment] = useState(false);

  useEffect(() => {
    setInternComment(savedInternComment);
  }, [savedInternComment]);

  const hasSpan = isDaySpan(day.day_from, day.day_to, day.work_day);

  const handleSaveInternComment = async () => {
    setIsSavingComment(true);
    try {
      await onUpdateInternComment?.(day.id, internComment);
    } catch {
      // Status shown at Adaptation page level.
    } finally {
      setIsSavingComment(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <dl className="flex flex-wrap items-stretch gap-2">
          <div className={DAY_META_CHIP_CLASS}>
            <MetaPair
              label="День"
              value={formatDayRange(day.day_from, day.day_to, day.work_day)}
            />
          </div>
          <div className={DAY_META_CHIP_CLASS}>
            {hasSpan ? (
              <>
                <MetaPair
                  label="Дата начала"
                  value={convertDate(day.date_from)}
                />
                <MetaPair
                  label="Дата окончания"
                  value={day.date_to ? convertDate(day.date_to) : ""}
                />
              </>
            ) : (
              <MetaPair label="Дата" value={convertDate(day.date_from)} />
            )}
          </div>
          <div
            className={cn(
              DAY_META_CHIP_CLASS,
              COMPLETION_CHIP_CLASS[day.completion],
              "ml-auto",
            )}
          >
            <MetaPair
              label="Статус дня"
              value={capitalizeFirst(day.completion)}
              valueClassName={COMPLETION_VALUE_CLASS[day.completion]}
            />
          </div>
        </dl>

        <div className="mt-4 flex flex-col gap-2">
          {day.tasks && day.tasks.length > 0 ? (
            day.tasks.map((task, index) => (
              <div
                key={task.id ?? index}
                className="rounded-lg bg-muted/60 p-3"
              >
                <TaskItem
                  task={task}
                  dayId={day.id}
                  onUpdateTaskStatus={onUpdateTaskStatus}
                />
              </div>
            ))
          ) : (
            <p className="m-0 text-sm text-muted-foreground">
              На этот день задачи не назначены
            </p>
          )}
        </div>

        <Collapsible className="group/collapsible mt-4">
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-full justify-between rounded-lg bg-muted/60 px-3 font-semibold text-foreground hover:bg-muted"
            >
              Комментарии
              <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-4 pt-2">
            <Field>
              <FieldLabel>Комментарий УПиПК</FieldLabel>
              <ReadonlyFieldValue value={day.employee_comment ?? ""} />
            </Field>

            <CommentFieldWithSave
              label="Комментарий стажера"
              value={internComment}
              savedValue={savedInternComment}
              isSaving={isSavingComment}
              onChange={setInternComment}
              onSave={() => void handleSaveInternComment()}
            />

            {READONLY_COMMENT_FIELDS.map((field) => (
              <Field key={field.key}>
                <FieldLabel>{field.label}</FieldLabel>
                <ReadonlyFieldValue value={day[field.key] ?? ""} />
              </Field>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default CareerDay;
