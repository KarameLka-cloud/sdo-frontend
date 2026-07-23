export const parseEntityId = (value: string | undefined): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const toDateInputValue = (value?: string | null) =>
  value ? value.split("T")[0] : "";

export const toTimeInputValue = (value?: string | null) => {
  if (!value) return "";
  const [hours, minutes] = value.split(":");
  return hours && minutes ? `${hours}:${minutes}` : "";
};
