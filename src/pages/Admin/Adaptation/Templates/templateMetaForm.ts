import { parsePositiveInt } from "@/utils/formValues.ts";

export function validateTemplateMeta(
  name: string,
  workSchedule: string,
  shift: string,
): { ok: true; name: string; workSchedule: string; shift: number } | { ok: false; error: string } {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { ok: false, error: "Укажите название шаблона" };
  }
  if (!workSchedule) {
    return { ok: false, error: "Выберите график работы" };
  }

  const shiftNumber = parsePositiveInt(shift);
  if (shiftNumber === null) {
    return { ok: false, error: "Укажите корректный номер смены" };
  }

  return {
    ok: true,
    name: trimmedName,
    workSchedule,
    shift: shiftNumber,
  };
}
