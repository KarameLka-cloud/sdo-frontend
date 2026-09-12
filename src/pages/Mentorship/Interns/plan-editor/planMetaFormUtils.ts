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
