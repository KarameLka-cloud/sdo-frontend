import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserType } from "@/interfaces/api/UserType.ts";
import Loader from "@/components/ui/custom/Loader";
import DataMessage from "@/components/ui/custom/DataMessage";
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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminListToolbar from "@/pages/Admin/shared/components/AdminListToolbar";
import AdminTableRowActions from "@/pages/Admin/shared/components/AdminTableRowActions";
import AdminTableEmptyRow from "@/pages/Admin/shared/components/AdminTableEmptyRow";
import {
  USER_ROUTES,
  buildEditPath,
} from "@/pages/Admin/shared/adminResourceConfig.ts";

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
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetUsersQuery("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<UsersTab>("users");

  const filteredData = useFiltered(filterByTab(data ?? [], activeTab), search);
  const hasSearch = search.trim().length > 0;
  const tabConfig = TABS[activeTab];

  return (
    <>
      <AdminListToolbar
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

      {error && <DataMessage type="error" />}
      {isLoading && <Loader />}

      {data && (
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
              <AdminTableEmptyRow
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
                const editPath =
                  user.id != null
                    ? buildEditPath(USER_ROUTES.edit, user.id)
                    : null;

                return (
                  <TableRow
                    key={user.id}
                    className={editPath ? "cursor-pointer" : undefined}
                    onClick={() => editPath && navigate(editPath)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.department}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role_name ? "destructive" : "secondary"}>
                        {user.role_name ?? "Пользователь"}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {editPath && (
                        <AdminTableRowActions
                          editPath={editPath}
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
      )}
    </>
  );
}

export default Users;
