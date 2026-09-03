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

export function isDayDirty(
  day: EditablePlanDay,
  initial: EditablePlanDay | undefined,
  permissions: CommentPermissions,
): boolean {
  if (!initial) {
    return true;
  }

  const next = getEffectiveDayFields(day, initial, permissions);
  const prev = getEffectiveDayFields(initial, initial, permissions);

  return (
    next.date_from !== prev.date_from ||
    next.date_to !== prev.date_to ||
    next.completion !== prev.completion ||
    next.employee_comment !== prev.employee_comment ||
    next.intern_comment !== prev.intern_comment ||
    next.mentor_comment !== prev.mentor_comment ||
    next.department_head_comment !== prev.department_head_comment
  );
}
