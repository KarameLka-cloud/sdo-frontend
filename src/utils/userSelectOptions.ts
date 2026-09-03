import type { SearchableComboboxOption } from "@/components/ui/custom/SearchableCombobox";
import type { UserType } from "@/interfaces/api/UserType.ts";

export const toUserOptions = (list: UserType[]): SearchableComboboxOption[] =>
  list
    .filter((user): user is UserType & { id: number } => user.id != null)
    .map((user) => ({
      value: String(user.id),
      label: user.name ?? "",
    }));

/** Keep the plan's current assignee visible even if they are missing from the role list. */
export const withAssignedUser = (
  users: UserType[],
  assigned: { id?: number; name?: string } | undefined,
  assignedId?: number | null,
): UserType[] => {
  const id = assigned?.id ?? assignedId ?? null;
  if (id == null || users.some((user) => user.id === id)) {
    return users;
  }

  return [
    ...users,
    {
      id,
      name: assigned?.name ?? `Пользователь ID: ${id}`,
    },
  ];
};
