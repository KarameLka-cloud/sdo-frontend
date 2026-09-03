import type { CompletionStatus } from "@/interfaces/api/AdaptationPlanType.ts";

export const DAY_META_CHIP_CLASS =
  "flex min-h-11 w-fit max-w-full min-w-0 flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-muted/60 px-3";

export const COMPLETION_CHIP_CLASS: Record<CompletionStatus, string> = {
  "в процессе": "bg-sky-50",
  выполнен: "bg-emerald-50",
  "есть замечания": "bg-amber-50",
};

export const COMPLETION_VALUE_CLASS: Record<CompletionStatus, string> = {
  "в процессе": "text-sky-800",
  выполнен: "text-emerald-700",
  "есть замечания": "text-amber-800",
};

export function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase("ru-RU") + value.slice(1);
}
