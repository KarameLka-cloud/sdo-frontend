export function formatShifts(shifts: number[]): string {
  return [...shifts].sort((a, b) => a - b).join(", ");
}

export function firstShift(shifts: number[]): number | undefined {
  if (shifts.length === 0) return undefined;
  return Math.min(...shifts);
}
