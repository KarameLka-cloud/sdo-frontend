import convertDate from "@/utils/convertDate.ts";

/** "01.02.2026" for a single day, "01.02.2026 - 03.02.2026" for a span. */
export function formatDateRange(
  dateFrom: string,
  dateTo?: string | null,
): string {
  const from = convertDate(dateFrom);
  return dateTo ? `${from} - ${convertDate(dateTo)}` : from;
}

export function formatDayRange(
  dayFrom: number | null | undefined,
  dayTo: number | null | undefined,
  fallbackDay: number,
  prefix = "",
): string {
  const from = dayFrom ?? fallbackDay;
  const to = dayTo ?? from;
  const label = from === to ? `${from}` : `${from}-${to}`;
  return prefix ? `${prefix} ${label}` : label;
}

/** True when the template block covers several working days rather than one. */
export function isDaySpan(
  dayFrom: number | null | undefined,
  dayTo: number | null | undefined,
  fallbackDay: number,
): boolean {
  const from = dayFrom ?? fallbackDay;
  return (dayTo ?? from) > from;
}

/** Ascending by start day, then end day. Missing start goes last. */
export function compareDayRanges(
  aFrom: number | null | undefined,
  aTo: number | null | undefined,
  bFrom: number | null | undefined,
  bTo: number | null | undefined,
): number {
  const aStart = aFrom ?? Number.POSITIVE_INFINITY;
  const bStart = bFrom ?? Number.POSITIVE_INFINITY;
  if (aStart !== bStart) {
    return aStart - bStart;
  }

  return (aTo ?? aStart) - (bTo ?? bStart);
}
