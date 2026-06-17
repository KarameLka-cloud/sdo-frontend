export const convertTime = (inputTime?: string | null): string => {
  if (!inputTime?.trim()) return "";
  const [hours, minutes] = inputTime.split(":");
  return hours && minutes ? `${hours}:${minutes}` : "";
};
