import { JSX } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcn/collapsible";
import { Field, FieldLabel } from "@/components/ui/shadcn/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import PlanTaskRow from "@/components/adaptation/PlanTaskRow";
import {
  COMPLETION_CHIP_CLASS,
  COMPLETION_VALUE_CLASS,
  DAY_META_CHIP_CLASS,
} from "@/components/adaptation/dayCardMeta";
import DatePickerField from "@/components/ui/custom/DatePickerField";
import ReadonlyFieldValue from "@/components/ui/custom/ReadonlyFieldValue";
import { cn } from "@/lib/utils";
import { formatDayRange, isDaySpan } from "@/utils/formatDayRange.ts";
import CommentFieldWithSave from "@/pages/Mentorship/Interns/plan-editor/CommentFieldWithSave";
import type {
  CommentFieldKey,
  CommentPermissions,
  EditableCommentKey,
  EditablePlanDay,
} from "@/pages/Mentorship/Interns/plan-editor/types.ts";

const COMMENT_FIELDS: Array<{
  key: CommentFieldKey;
  label: string;
  canEdit: keyof CommentPermissions;
  saveKey?: EditableCommentKey;
}> = [
  {
    key: "employee_comment",
    label: "Комментарий УПиПК",
    canEdit: "canEditEmployee",
    saveKey: "employee_comment",
  },
  {
    key: "intern_comment",
    label: "Комментарий стажера",
    canEdit: "canEditIntern",
  },
  {
    key: "mentor_comment",
    label: "Комментарий наставника",
    canEdit: "canEditMentor",
    saveKey: "mentor_comment",
  },
  {
    key: "department_head_comment",
    label: "Комментарий руководителя",
    canEdit: "canEditDepartmentHead",
    saveKey: "department_head_comment",
  },
];

interface PlanDayCardProps {
  day: EditablePlanDay;
  initialDay?: EditablePlanDay;
  commentPermissions: CommentPermissions;
  savingCommentKey: string | null;
  savingTaskKey: string | null;
  isSavingDayFields: boolean;
  onDayFieldChange: (
    patch: Partial<Pick<EditablePlanDay, "date_from" | "date_to" | "completion">>,
  ) => void;
  onCommentChange: (commentKey: CommentFieldKey, value: string) => void;
  onTaskStatusChange: (
    taskIndex: number,
    status: EditablePlanDay["tasks"][number]["status"],
  ) => void;
  onSaveComment: (commentKey: EditableCommentKey) => void;
}

function PlanDayCard({
  day,
  initialDay,
  commentPermissions,
  savingCommentKey,
  savingTaskKey,
  isSavingDayFields,
  onDayFieldChange,
  onCommentChange,
  onTaskStatusChange,
  onSaveComment,
}: PlanDayCardProps): JSX.Element {
  const hasSpan = isDaySpan(day.day_from, day.day_to, day.work_day);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-stretch gap-2">
          <div className={DAY_META_CHIP_CLASS}>
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="shrink-0 text-xs text-muted-foreground">
                День
              </span>
              <span className="min-w-0 text-sm font-medium wrap-break-word">
                {formatDayRange(day.day_from, day.day_to, day.work_day)}
              </span>
            </div>
          </div>
          <div className={DAY_META_CHIP_CLASS}>
            <DatePickerField
              compact
              dateId={`day-date-from-${day.id}`}
              dateLabel={hasSpan ? "Дата начала" : "Дата"}
              date={day.date_from}
              onDateChange={(value) => onDayFieldChange({ date_from: value })}
            />
            {hasSpan && (
              <DatePickerField
                compact
                dateId={`day-date-to-${day.id}`}
                dateLabel="Дата окончания"
                date={day.date_to ?? ""}
                onDateChange={(value) =>
                  onDayFieldChange({ date_to: value || null })
                }
              />
            )}
          </div>
          <div
            className={cn(
              DAY_META_CHIP_CLASS,
              COMPLETION_CHIP_CLASS[day.completion],
              "ml-auto",
            )}
          >
            <FieldLabel
              htmlFor={`day-status-${day.id}`}
              className="shrink-0 text-xs font-normal text-muted-foreground"
            >
              Статус дня
            </FieldLabel>
            <Select
              value={day.completion}
              disabled={isSavingDayFields}
              onValueChange={(value) =>
                onDayFieldChange({
                  completion: value as EditablePlanDay["completion"],
                })
              }
            >
              <SelectTrigger
                id={`day-status-${day.id}`}
                size="sm"
                className={cn(
                  "h-7 w-auto border-0 bg-transparent px-1.5 font-medium shadow-none",
                  COMPLETION_VALUE_CLASS[day.completion],
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="в процессе">В процессе</SelectItem>
                <SelectItem value="выполнен">Выполнен</SelectItem>
                <SelectItem value="есть замечания">Есть замечания</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {day.tasks.length > 0 ? (
            day.tasks.map((task, taskIndex) => (
              <div
                key={task.id}
                className="rounded-lg bg-muted/60 p-3"
              >
                <PlanTaskRow
                  description={task.description}
                  status={task.status}
                  responsibleRole={task.responsible_role}
                  links={task.links}
                  disabled={savingTaskKey === `${day.id}-${task.id}`}
                  onStatusChange={(status) =>
                    onTaskStatusChange(taskIndex, status)
                  }
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
            {COMMENT_FIELDS.map((field) => {
              const saveKey = field.saveKey;
              if (commentPermissions[field.canEdit] && saveKey) {
                return (
                  <CommentFieldWithSave
                    key={field.key}
                    label={field.label}
                    value={day[field.key]}
                    savedValue={initialDay?.[field.key] ?? ""}
                    isSaving={savingCommentKey === `${day.id}-${saveKey}`}
                    onChange={(value) => onCommentChange(field.key, value)}
                    onSave={() => onSaveComment(saveKey)}
                  />
                );
              }

              return (
                <Field key={field.key}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <ReadonlyFieldValue value={day[field.key]} />
                </Field>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default PlanDayCard;
