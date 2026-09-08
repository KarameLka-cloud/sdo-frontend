import { JSX, useState } from "react";
import { UserType } from "@/interfaces/api/UserType.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useGetUsersQuery } from "@/services/store/features/users.ts";
import { isUserInRole, ROLE_LABELS, USER_ROLES, displayRoleName, type UserRole } from "@/constants/roles.ts";
import { Badge } from "@/components/ui/shadcn/badge";
import { Field } from "@/components/ui/shadcn/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import ResourceListPage, {
  type ResourceColumn,
} from "@/components/resource-list/ResourceListPage";
import ResourceTableRowActions from "@/components/resource-list/ResourceTableRowActions";
import UserEditDialog from "@/pages/Admin/Users/UserEditDialog";

const TABS = {
  users: { label: "Все пользователи" },
  admins: { label: ROLE_LABELS.ADMIN, role: USER_ROLES.ADMIN },
  supervisors: { label: ROLE_LABELS.SUPERVISOR, role: USER_ROLES.SUPERVISOR },
  department_heads: {
    label: ROLE_LABELS.DEPARTMENT_HEAD,
    role: USER_ROLES.DEPARTMENT_HEAD,
  },
  mentors: { label: ROLE_LABELS.MENTOR, role: USER_ROLES.MENTOR },
} as const satisfies Record<string, { label: string; role?: UserRole }>;

type UsersTab = keyof typeof TABS;

const TAB_IDS = Object.keys(TABS) as UsersTab[];

const COLUMNS: ResourceColumn<UserType>[] = [
  {
    key: "name",
    label: "Имя пользователя",
    className: "font-medium",
    render: (user) => user.name,
  },
  {
    key: "department",
    label: "Отдел",
    className: "text-muted-foreground",
    render: (user) => user.department,
  },
  {
    key: "role",
    label: "Роль",
    render: (user) => (
      <Badge variant={user.role_name ? "destructive" : "secondary"}>
        {displayRoleName(user.role, user.role_name) ?? "Пользователь"}
      </Badge>
    ),
  },
];

const filterByTab = (users: UserType[], tab: UsersTab) => {
  const tabConfig = TABS[tab];
  if (!("role" in tabConfig) || !tabConfig.role) return users;
  return users.filter((user) => isUserInRole(user, tabConfig.role));
};

function Users(): JSX.Element {
  const { data, error, isLoading } = useGetUsersQuery(undefined);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<UsersTab>("users");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const users = data ?? [];
  const filteredData = useFiltered(filterByTab(users, activeTab), search);
  const tabConfig = TABS[activeTab];
  const editingUser =
    editingUserId != null
      ? (users.find((user) => user.id === editingUserId) ?? null)
      : null;

  return (
    <ResourceListPage
      searchId="users-search"
      searchPlaceholder="Имя, отдел, роль..."
      search={search}
      onSearchChange={setSearch}
      toolbarLeftSlot={
        <Field className="min-w-48">
          <Select
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as UsersTab)}
          >
            <SelectTrigger id="users-role" size="sm" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAB_IDS.map((tab) => (
                <SelectItem key={tab} value={tab}>
                  {TABS[tab].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      }
      isLoading={isLoading}
      isError={Boolean(error)}
      hasData={Boolean(data)}
      items={filteredData}
      columns={COLUMNS}
      getRowKey={(user) => user.id ?? user.login ?? user.name ?? ""}
      onRowClick={(user) => user.id != null && setEditingUserId(user.id)}
      renderActions={(user) =>
        user.id != null && (
          <ResourceTableRowActions
            onEdit={() => setEditingUserId(user.id ?? null)}
            isDeleting={false}
            showDelete={false}
          />
        )
      }
      notFoundMessage={`Пользователь «${search}» не найден`}
      emptyContent={
        "role" in tabConfig ? (
          <p className="text-sm text-muted-foreground">
            Нет пользователей с ролью «{tabConfig.label}»
          </p>
        ) : undefined
      }
    >
      <UserEditDialog
        user={editingUser}
        open={editingUserId != null}
        onOpenChange={(open) => {
          if (!open) setEditingUserId(null);
        }}
      />
    </ResourceListPage>
  );
}

export default Users;
