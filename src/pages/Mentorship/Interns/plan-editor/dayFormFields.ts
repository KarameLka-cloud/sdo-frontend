import type {
  CommentPermissions,
  EditablePlanDay,
} from "@/pages/Mentorship/Interns/plan-editor/types.ts";

function normalizeComment(value: string | null | undefined): string {
  return value ?? "";
}

function normalizeOptionalDate(value: string | null | undefined): string | null {
  return value || null;
}

/** Effective day payload fields that would be sent on save (respecting comment edit permissions). */
export function getEffectiveDayFields(
  day: EditablePlanDay,
  initial: EditablePlanDay | undefined,
  permissions: CommentPermissions,
) {
  return {
    date_from: day.date_from,
    date_to: normalizeOptionalDate(day.date_to),
    completion: day.completion,
    employee_comment: normalizeComment(
      permissions.canEditEmployee
        ? day.employee_comment
        : (initial?.employee_comment ?? ""),
    ),
    intern_comment: normalizeComment(
      permissions.canEditIntern
        ? day.intern_comment
        : (initial?.intern_comment ?? ""),
    ),
    mentor_comment: normalizeComment(
      permissions.canEditMentor
        ? day.mentor_comment
        : (initial?.mentor_comment ?? ""),
    ),
    department_head_comment: normalizeComment(
      permissions.canEditDepartmentHead
        ? day.department_head_comment
        : (initial?.department_head_comment ?? ""),
    ),
  };
}

/** Manager day PATCH body. Intern comments are saved through a separate endpoint. */
export function toDayUpdateBody(
  planId: number,
  day: EditablePlanDay,
  initial: EditablePlanDay | undefined,
  permissions: CommentPermissions,
) {
  const fields = getEffectiveDayFields(day, initial, permissions);

  return {
    planId,
    dayId: day.id,
    date_from: fields.date_from,
    date_to: fields.date_to,
    completion: fields.completion,
    employee_comment: fields.employee_comment || null,
    mentor_comment: fields.mentor_comment || null,
    department_head_comment: fields.department_head_comment || null,
  };
}
