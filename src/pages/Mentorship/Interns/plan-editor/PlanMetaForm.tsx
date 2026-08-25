import { FormEvent, JSX } from "react";
import { UserType } from "@/interfaces/api/UserType.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Separator } from "@/components/ui/shadcn/separator";
import DatePickerField from "@/components/ui/custom/DatePickerField";
import ResourceEditFormFooter from "@/components/resource-list/ResourceEditFormFooter";

export interface PlanMetaFormValues {
  startDate: string;
  shift: number;
  mentor: number | null;
  departmentHead: number | null;
}

interface PlanMetaFormProps {
  internLabel: string;
  workSchedule: string;
  templateName: string | null;
  form: PlanMetaFormValues;
  mentors: UserType[];
  heads: UserType[];
  isSaving: boolean;
  isDeleting: boolean;
  onFormChange: (next: PlanMetaFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}

function PlanMetaForm({
  internLabel,
  workSchedule,
  templateName,
  form,
  mentors,
  heads,
  isSaving,
  isDeleting,
  onFormChange,
  onSubmit,
  onDelete,
}: PlanMetaFormProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Редактирование плана адаптации</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="p-4">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="plan-intern">Стажер</FieldLabel>
              <Input
                id="plan-intern"
                value={internLabel}
                readOnly
                disabled
              />
            </Field>
            <DatePickerField
              dateId="plan-start-date"
              dateLabel="Дата начала стажировки"
              date={form.startDate}
              onDateChange={(value) =>
                onFormChange({ ...form, startDate: value })
              }
            />
            <Field>
              <FieldLabel htmlFor="plan-schedule">Режим работы</FieldLabel>
              <Input
                id="plan-schedule"
                value={workSchedule}
                readOnly
                disabled
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plan-template">Шаблон адаптации</FieldLabel>
              <Input
                id="plan-template"
                value={
                  templateName
                    ? `${templateName} (смена: ${form.shift})`
                    : "—"
                }
                readOnly
                disabled
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plan-mentor">Наставник</FieldLabel>
              <Select
                value={form.mentor ? String(form.mentor) : ""}
                onValueChange={(value) =>
                  onFormChange({ ...form, mentor: Number(value) })
                }
              >
                <SelectTrigger id="plan-mentor" className="w-full">
                  <SelectValue placeholder="Выберите наставника" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={String(mentor.id)}>
                      {mentor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="plan-head">Руководитель отдела</FieldLabel>
              <Select
                value={form.departmentHead ? String(form.departmentHead) : ""}
                onValueChange={(value) =>
                  onFormChange({ ...form, departmentHead: Number(value) })
                }
              >
                <SelectTrigger id="plan-head" className="w-full">
                  <SelectValue placeholder="Выберите руководителя" />
                </SelectTrigger>
                <SelectContent>
                  {heads.map((head) => (
                    <SelectItem key={head.id} value={String(head.id)}>
                      {head.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </CardContent>
        <Separator />
        <ResourceEditFormFooter
          isSaving={isSaving}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />
      </form>
    </Card>
  );
}

export default PlanMetaForm;
