import { UserType } from "@/interfaces/api/UserType.ts";
import { isUserInRole, type UserRole } from "@/constants/roles.ts";

export const resolveRoleUsers = (
  fromApi: UserType[] | undefined,
  allUsers: UserType[],
  role: UserRole,
): UserType[] => {
  const list = fromApi ?? [];
  return list.length
    ? list
    : allUsers.filter((user) => isUserInRole(user, role));
};
