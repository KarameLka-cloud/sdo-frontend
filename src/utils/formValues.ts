export const parseEntityId = (value: string | undefined): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

/** Positive integer from a form string (e.g. shift number). */
export const parsePositiveInt = parseEntityId;

export const toDateInputValue = (value?: string | null) =>
  value ? value.split("T")[0] : "";

export { convertTime as toTimeInputValue } from "./convertTime.ts";
