import type { AdaptationPlanDayType, AdaptationPlanType } from "@/interfaces/api/AdaptationPlanType.ts";
import { compareDayRanges } from "@/utils/formatDayRange.ts";

export function hasAdaptationPlan(
  plan: AdaptationPlanType | null | undefined,
): plan is AdaptationPlanType {
  return Boolean(plan?.id && plan.id > 0);
}

export function sortAdaptationDays<T extends Pick<AdaptationPlanDayType, "work_day"> & {
  day_from?: number | null;
  day_to?: number | null;
}>(days: T[]): T[] {
  return [...days].sort((left, right) =>
    compareDayRanges(
      left.day_from ?? left.work_day,
      left.day_to,
      right.day_from ?? right.work_day,
      right.day_to,
    ),
  );
}
