export const USER_ROLES = {
  ADMIN: "ADMIN",
  MENTOR: "MENTOR",
  DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

interface UserRoleSource {
  role?: string;
  role_name?: string;
}

const ROLE_ALIASES: Record<UserRole, readonly string[]> = {
  [USER_ROLES.ADMIN]: ["admin", "администратор"],
  [USER_ROLES.MENTOR]: ["mentor", "наставник"],
  [USER_ROLES.DEPARTMENT_HEAD]: ["department_head", "руководитель отдела"],
};

const normalizeRoleValue = (value: string | undefined): string =>
  value?.trim().toLowerCase() ?? "";

export const MENTOR_ACCESS_ROLES = [
  USER_ROLES.ADMIN,
  USER_ROLES.MENTOR,
  USER_ROLES.DEPARTMENT_HEAD,
] as const;

export const hasRole = (
  role: string | undefined,
  roleName: string | undefined,
  targetRole: UserRole,
): boolean => {
  const normalizedRole = normalizeRoleValue(role);
  const normalizedRoleName = normalizeRoleValue(roleName);
  const aliases = ROLE_ALIASES[targetRole];

  return (
    aliases.includes(normalizedRole) || aliases.includes(normalizedRoleName)
  );
};

export const hasAnyRoleFromUser = (
  role: string | undefined,
  roleName: string | undefined,
  allowedRoles: readonly UserRole[],
): boolean =>
  allowedRoles.some((allowedRole) => hasRole(role, roleName, allowedRole));

export const isUserInRole = (
  user: UserRoleSource,
  targetRole: UserRole,
): boolean => {
  return hasRole(user.role, user.role_name, targetRole);
};
