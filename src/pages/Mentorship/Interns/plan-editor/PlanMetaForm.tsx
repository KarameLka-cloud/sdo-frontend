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
import DatePickerField from "@/components/ui/custom/DatePickerField";
import SearchableCombobox from "@/components/ui/custom/SearchableCombobox";
import ResourceEditFormFooter from "@/components/resource-list/ResourceEditFormFooter";
import type { AdaptationPlanType } from "@/interfaces/api/AdaptationPlanType.ts";
import { toDateInputValue } from "@/utils/formValues.ts";
import { toUserOptions } from "@/utils/userSelectOptions.ts";

export interface PlanMetaFormValues {
  startDate: string;
  templateId: number | null;
  shift: number;
  mentor: number | null;
  departmentHead: number | null;
}

/** Merge editable form state with loaded plan data for validation and save. */
export function resolvePlanMetaForm(
  form: PlanMetaFormValues,
  plan: Pick<
    AdaptationPlanType,
    | "start_date"
    | "adaptation_plan_template_id"
    | "shift"
    | "mentor"
    | "department_head"
    | "department_head_user"
    | "mentor_user"
    | "template"
  >,
): PlanMetaFormValues {
  return {
    startDate: form.startDate || toDateInputValue(plan.start_date),
    templateId:
      form.templateId ??
      plan.adaptation_plan_template_id ??
      plan.template?.id ??
      null,
    shift: form.shift ?? plan.shift ?? 1,
    mentor: form.mentor ?? plan.mentor ?? plan.mentor_user?.id ?? null,
    departmentHead:
      form.departmentHead ??
      plan.department_head ??
      plan.department_head_user?.id ??
      null,
  };
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
              <SearchableCombobox
                id="plan-mentor"
                value={form.mentor ? String(form.mentor) : ""}
                onValueChange={(value) =>
                  onFormChange({
                    ...form,
                    mentor: value ? Number(value) : null,
                  })
                }
                options={toUserOptions(mentors)}
                placeholder="Выберите наставника"
                searchPlaceholder="Поиск наставника..."
                emptyMessage="Наставник не найден"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plan-head">Руководитель отдела</FieldLabel>
              <SearchableCombobox
                id="plan-head"
                value={form.departmentHead ? String(form.departmentHead) : ""}
                onValueChange={(value) =>
                  onFormChange({
                    ...form,
                    departmentHead: value ? Number(value) : null,
                  })
                }
                options={toUserOptions(heads)}
                placeholder="Выберите руководителя"
                searchPlaceholder="Поиск руководителя..."
                emptyMessage="Руководитель не найден"
              />
            </Field>
          </FieldGroup>
        </CardContent>
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
