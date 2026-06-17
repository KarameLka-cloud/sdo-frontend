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
