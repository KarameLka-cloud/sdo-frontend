export const USER_ROLES = {
  ADMIN: "ADMIN",
  MENTOR: "MENTOR",
  DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const hasAnyRole = (
  role: string | undefined,
  allowedRoles: readonly UserRole[],
): boolean => {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(role as UserRole);
};
