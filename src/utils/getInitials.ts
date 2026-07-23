export const getInitials = (name?: string): string => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const [lastName = "", firstName = ""] = parts;
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};
