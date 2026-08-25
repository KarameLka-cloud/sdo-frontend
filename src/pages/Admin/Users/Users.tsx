import { JSX, useState } from "react";
import { UserType } from "@/interfaces/api/UserType.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useGetUsersQuery } from "@/services/store/features/user.ts";
import { isUserInRole, USER_ROLES, type UserRole } from "@/constants/roles.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { Badge } from "@/components/ui/shadcn/badge";
import { Field } from "@/components/ui/shadcn/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import ResourceListToolbar from "@/components/resource-list/ResourceListToolbar";
import ResourceTableRowActions from "@/components/resource-list/ResourceTableRowActions";
import ResourceTableEmptyRow from "@/components/resource-list/ResourceTableEmptyRow";
import QueryState from "@/components/resource-list/QueryState";
import UserEditDialog from "@/pages/Admin/Users/UserEditDialog";

const TABS = {
  users: { label: "Все пользователи" },
  admins: { label: "Администраторы", role: USER_ROLES.ADMIN },
  department_heads: {
    label: "Руководители отделов",
    role: USER_ROLES.DEPARTMENT_HEAD,
  },
  mentors: { label: "Наставники", role: USER_ROLES.MENTOR },
} as const satisfies Record<string, { label: string; role?: UserRole }>;

type UsersTab = keyof typeof TABS;

const TAB_IDS = Object.keys(TABS) as UsersTab[];

const filterByTab = (users: UserType[], tab: UsersTab) => {
  const tabConfig = TABS[tab];
  if (!("role" in tabConfig) || !tabConfig.role) {
    return users;
  }
  return users.filter((user) => isUserInRole(user, tabConfig.role));
};

function Users(): JSX.Element {
  const { data, error, isLoading } = useGetUsersQuery(undefined);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<UsersTab>("users");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const users = data ?? [];
  const filteredData = useFiltered(filterByTab(users, activeTab), search);
  const hasSearch = search.trim().length > 0;
  const tabConfig = TABS[activeTab];
  const editingUser =
    editingUserId != null
      ? (users.find((user) => user.id === editingUserId) ?? null)
      : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ResourceListToolbar
        searchId="users-search"
        searchPlaceholder="Имя, отдел, роль..."
        search={search}
        onSearchChange={setSearch}
        leftSlot={
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
      />

      <QueryState isLoading={isLoading} isError={Boolean(error)} hasData={Boolean(data)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя пользователя</TableHead>
              <TableHead>Отдел</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <ResourceTableEmptyRow
                colSpan={4}
                hasSearch={hasSearch}
                notFoundMessage={`Пользователь «${search}» не найден`}
                emptyContent={
                  "role" in tabConfig ? (
                    <p className="text-sm text-muted-foreground">
                      Нет пользователей с ролью «{tabConfig.label}»
                    </p>
                  ) : undefined
                }
              />
            ) : (
              filteredData.map((user) => {
                const canEdit = user.id != null;

                return (
                  <TableRow
                    key={user.id}
                    className={canEdit ? "cursor-pointer" : undefined}
                    onClick={() => canEdit && setEditingUserId(user.id ?? null)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.department}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role_name ? "destructive" : "secondary"}
                      >
                        {user.role_name ?? "Пользователь"}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {canEdit && (
                        <ResourceTableRowActions
                          onEdit={() => setEditingUserId(user.id ?? null)}
                          isDeleting={false}
                          showDelete={false}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </QueryState>

      <UserEditDialog
        user={editingUser}
        open={editingUserId != null}
        onOpenChange={(open) => {
          if (!open) setEditingUserId(null);
        }}
      />
    </div>
  );
}

export default Users;
