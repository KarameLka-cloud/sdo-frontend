import { LearningType } from "@/interfaces/api/LearningItemType.ts";
import { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import { PositionType } from "@/interfaces/api/PositionType.ts";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import SearchableCombobox from "@/components/ui/custom/SearchableCombobox";
import DatePickerField from "@/components/ui/custom/DatePickerField";
import {
  learningHasTime,
  learningNeedsDepartments,
  learningNeedsPositions,
} from "@/constants/learning.ts";
import type { LearningItemFormValues } from "@/pages/Admin/Learning/learningForm.ts";

function LearningItemFormFields({
  type,
  values,
  onChange,
  departments = [],
  positions = [],
}: {
  type: LearningType;
  values: LearningItemFormValues;
  onChange: (patch: Partial<LearningItemFormValues>) => void;
  departments?: DepartmentType[];
  positions?: PositionType[];
}) {
  const needsDepartments = learningNeedsDepartments(type);
  const needsPositions = learningNeedsPositions(type);
  const hasTime = learningHasTime(type);

  return (
    <FieldGroup className="grid gap-4">
      <Field>
        <FieldLabel htmlFor="learning-title">Название</FieldLabel>
        <Input
          id="learning-title"
          value={values.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="learning-description">Описание</FieldLabel>
        <Textarea
          id="learning-description"
          value={values.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Опционально"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="learning-link">
          {hasTime ? "Ссылка на доп. материалы" : "Ссылка"}
        </FieldLabel>
        <Input
          id="learning-link"
          value={values.link}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder={hasTime ? "Опционально" : undefined}
        />
      </Field>

      {needsDepartments && (
        <div className="grid w-full grid-cols-[30%_minmax(0,1fr)] gap-4">
          <Field>
            <FieldLabel htmlFor="learning-department">Отдел</FieldLabel>
            <SearchableCombobox
              id="learning-department"
              value={values.departmentId}
              onValueChange={(departmentId) => onChange({ departmentId })}
              options={departments.map((department) => ({
                value: String(department.id),
                label: department.name,
              }))}
              placeholder="Выберите отдел"
              searchPlaceholder="Поиск отдела..."
              emptyMessage="Отдел не найден"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="learning-note-department">
              Примечание по отделу
            </FieldLabel>
            <Input
              id="learning-note-department"
              value={values.noteDepartment}
              onChange={(e) => onChange({ noteDepartment: e.target.value })}
              placeholder="Опционально"
            />
          </Field>
        </div>
      )}

      {needsPositions && (
        <div className="grid w-full grid-cols-[30%_minmax(0,1fr)] gap-4">
          <Field>
            <FieldLabel htmlFor="learning-position">Должность</FieldLabel>
            <Select
              value={values.positionId}
              onValueChange={(positionId) => onChange({ positionId })}
            >
              <SelectTrigger id="learning-position" className="w-full">
                <SelectValue placeholder="Выберите должность" />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                {positions.map((position) => (
                  <SelectItem key={position.id} value={String(position.id)}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="learning-note-position">Примечание</FieldLabel>
            <Input
              id="learning-note-position"
              value={values.notePosition}
              onChange={(e) => onChange({ notePosition: e.target.value })}
              placeholder="Опционально"
            />
          </Field>
        </div>
      )}

      <div
        className={`grid w-full gap-4 ${hasTime ? "grid-cols-3" : "grid-cols-2"}`}
      >
        <DatePickerField
          dateId="learning-date"
          dateLabel={
            type === "course" || type === "test" ? "Пройти до" : "Дата"
          }
          date={values.date}
          onDateChange={(date) => onChange({ date })}
          showTime={hasTime}
          timeId="learning-time"
          time={values.time}
          onTimeChange={(time) => onChange({ time })}
        />
        <Field>
          <FieldLabel htmlFor="learning-duration">
            Длительность (мин.)
          </FieldLabel>
          <Input
            id="learning-duration"
            type="number"
            min={1}
            value={values.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
          />
        </Field>
      </div>
    </FieldGroup>
  );
}

export default LearningItemFormFields;
