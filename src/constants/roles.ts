export const USER_ROLES = {
  ADMIN: "ADMIN",
  MENTOR: "MENTOR",
  SUPERVISOR: "SUPERVISOR",
  DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

interface UserRoleSource {
  role?: string;
  role_name?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: "Администратор",
  [USER_ROLES.MENTOR]: "Наставник",
  [USER_ROLES.SUPERVISOR]: "Руководитель отделения",
  [USER_ROLES.DEPARTMENT_HEAD]: "Начальник отдела",
};

const ROLE_ALIASES: Record<UserRole, readonly string[]> = {
  [USER_ROLES.ADMIN]: ["admin", "администратор"],
  [USER_ROLES.MENTOR]: ["mentor", "наставник"],
  [USER_ROLES.SUPERVISOR]: [
    "supervisor",
    "руководитель",
    "руководитель отделения",
    "руководитель отдела",
  ],
  [USER_ROLES.DEPARTMENT_HEAD]: [
    "department_head",
    "начальник отдела",
    "начальники отделов",
  ],
};

const normalizeRoleValue = (value: string | undefined): string =>
  value?.trim().toLowerCase() ?? "";

export const MENTOR_ACCESS_ROLES = [
  USER_ROLES.ADMIN,
  USER_ROLES.MENTOR,
  USER_ROLES.SUPERVISOR,
  USER_ROLES.DEPARTMENT_HEAD,
] as const;

export const PLAN_EDIT_ROLES = [
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

export const displayRoleName = (
  role?: string,
  roleName?: string,
): string | undefined => {
  for (const targetRole of Object.values(USER_ROLES)) {
    if (hasRole(role, roleName, targetRole)) {
      return ROLE_LABELS[targetRole];
    }
  }

  return roleName?.trim() || undefined;
};

export const displayRoleLabel = (roleName: string): string => {
  if ((Object.values(USER_ROLES) as string[]).includes(roleName)) {
    return ROLE_LABELS[roleName as UserRole];
  }

  return roleName;
};
