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
import RoleUserCombobox from "@/components/ui/custom/RoleUserCombobox";
import ResourceEditFormFooter from "@/components/resource-list/ResourceEditFormFooter";
import type { AdaptationPlanType } from "@/interfaces/api/AdaptationPlanType.ts";
import { toDateInputValue } from "@/utils/formValues.ts";

export interface PlanMetaFormValues {
  startDate: string;
  templateId: number | null;
  shift: number;
  mentor: number | null;
  supervisor: number | null;
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
    | "supervisor"
    | "department_head"
    | "department_head_user"
    | "mentor_user"
    | "supervisor_user"
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
    supervisor:
      form.supervisor ?? plan.supervisor ?? plan.supervisor_user?.id ?? null,
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
  supervisors: UserType[];
  heads: UserType[];
  isSaving: boolean;
  isDeleting: boolean;
  canEditMeta?: boolean;
  showDelete?: boolean;
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
  supervisors,
  heads,
  isSaving,
  isDeleting,
  canEditMeta = true,
  showDelete = true,
  onFormChange,
  onSubmit,
  onDelete,
}: PlanMetaFormProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {canEditMeta
            ? "Редактирование плана адаптации"
            : "План адаптации"}
        </CardTitle>
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
              disabled={!canEditMeta}
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
            <RoleUserCombobox
              field="mentor"
              value={form.mentor ? String(form.mentor) : ""}
              onValueChange={(value) =>
                onFormChange({
                  ...form,
                  mentor: value ? Number(value) : null,
                })
              }
              users={mentors}
              disabled={!canEditMeta}
            />
            <RoleUserCombobox
              field="supervisor"
              value={form.supervisor ? String(form.supervisor) : ""}
              onValueChange={(value) =>
                onFormChange({
                  ...form,
                  supervisor: value ? Number(value) : null,
                })
              }
              users={supervisors}
              disabled={!canEditMeta}
            />
            <RoleUserCombobox
              field="departmentHead"
              value={form.departmentHead ? String(form.departmentHead) : ""}
              onValueChange={(value) =>
                onFormChange({
                  ...form,
                  departmentHead: value ? Number(value) : null,
                })
              }
              users={heads}
              disabled={!canEditMeta}
            />
          </FieldGroup>
        </CardContent>
        <ResourceEditFormFooter
          isSaving={isSaving}
          isDeleting={isDeleting}
          onDelete={onDelete}
          canEdit={canEditMeta}
          showDelete={showDelete}
        />
      </form>
    </Card>
  );
}

export default PlanMetaForm;
