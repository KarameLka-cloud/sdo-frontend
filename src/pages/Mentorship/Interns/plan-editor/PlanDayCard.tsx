import { JSX } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import DatePickerField from "@/components/ui/custom/DatePickerField";
import ReadonlyFieldValue from "@/components/ui/custom/ReadonlyFieldValue";
import { formatDayRange } from "@/utils/formatDayRange.ts";
import CommentFieldWithSave from "@/pages/Mentorship/Interns/plan-editor/CommentFieldWithSave";
import type {
  CommentPermissions,
  EditableCommentKey,
  EditablePlanDay,
} from "@/pages/Mentorship/Interns/plan-editor/types.ts";

interface PlanDayCardProps {
  day: EditablePlanDay;
  initialDay?: EditablePlanDay;
  commentPermissions: CommentPermissions;
  savingCommentKey: string | null;
  onDayChange: (patch: Partial<EditablePlanDay>) => void;
  onTaskStatusChange: (taskIndex: number, status: EditablePlanDay["tasks"][number]["status"]) => void;
  onSaveComment: (commentKey: EditableCommentKey) => void;
}

function PlanDayCard({
  day,
  initialDay,
  commentPermissions,
  savingCommentKey,
  onDayChange,
  onTaskStatusChange,
  onSaveComment,
}: PlanDayCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {formatDayRange(day.day_from, day.day_to, day.work_day, "День")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <DatePickerField
            dateId={`day-date-from-${day.id}`}
            dateLabel="Дата от"
            date={day.date_from}
            onDateChange={(value) => onDayChange({ date_from: value })}
          />
          <DatePickerField
            dateId={`day-date-to-${day.id}`}
            dateLabel="Дата до (опционально)"
            date={day.date_to ?? ""}
            onDateChange={(value) => onDayChange({ date_to: value || null })}
          />
        </FieldGroup>
        <Field>
          <FieldLabel htmlFor={`day-status-${day.id}`}>Статус дня</FieldLabel>
          <Select
            value={day.completion}
            onValueChange={(value) =>
              onDayChange({
                completion: value as EditablePlanDay["completion"],
              })
            }
          >
            <SelectTrigger id={`day-status-${day.id}`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="в процессе">В процессе</SelectItem>
              <SelectItem value="выполнен">Выполнен</SelectItem>
              <SelectItem value="есть замечания">Есть замечания</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {commentPermissions.canEditEmployee ? (
          <CommentFieldWithSave
            label="Комментарий УПиПК"
            value={day.employee_comment}
            savedValue={initialDay?.employee_comment ?? ""}
            isSaving={savingCommentKey === `${day.id}-employee_comment`}
            onChange={(value) => onDayChange({ employee_comment: value })}
            onSave={() => onSaveComment("employee_comment")}
          />
        ) : (
          <Field>
            <FieldLabel>Комментарий УПиПК</FieldLabel>
            <ReadonlyFieldValue value={day.employee_comment} />
          </Field>
        )}
        <Field>
          <FieldLabel>Комментарий стажера</FieldLabel>
          <ReadonlyFieldValue value={day.intern_comment} />
        </Field>
        {commentPermissions.canEditMentor ? (
          <CommentFieldWithSave
            label="Комментарий наставника"
            value={day.mentor_comment}
            savedValue={initialDay?.mentor_comment ?? ""}
            isSaving={savingCommentKey === `${day.id}-mentor_comment`}
            onChange={(value) => onDayChange({ mentor_comment: value })}
            onSave={() => onSaveComment("mentor_comment")}
          />
        ) : (
          <Field>
            <FieldLabel>Комментарий наставника</FieldLabel>
            <ReadonlyFieldValue value={day.mentor_comment} />
          </Field>
        )}
        {commentPermissions.canEditDepartmentHead ? (
          <CommentFieldWithSave
            label="Комментарий руководителя"
            value={day.department_head_comment}
            savedValue={initialDay?.department_head_comment ?? ""}
            isSaving={
              savingCommentKey === `${day.id}-department_head_comment`
            }
            onChange={(value) =>
              onDayChange({ department_head_comment: value })
            }
            onSave={() => onSaveComment("department_head_comment")}
          />
        ) : (
          <Field>
            <FieldLabel>Комментарий руководителя</FieldLabel>
            <ReadonlyFieldValue value={day.department_head_comment} />
          </Field>
        )}

        <div className="flex flex-col gap-3">
          {day.tasks.map((task, taskIndex) => (
            <div
              key={task.id}
              className="grid grid-cols-[1fr_11rem] items-center gap-3 max-sm:grid-cols-1"
            >
              <span className="text-sm">{task.description}</span>
              <Select
                value={task.status}
                onValueChange={(value) =>
                  onTaskStatusChange(
                    taskIndex,
                    value as EditablePlanDay["tasks"][number]["status"],
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="не выполнено">Не выполнено</SelectItem>
                  <SelectItem value="выполнено">Выполнено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PlanDayCard;
