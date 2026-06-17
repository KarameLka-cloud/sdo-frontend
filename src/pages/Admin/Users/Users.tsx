import { JSX, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserType } from "@/interfaces/api/UserType.ts";
import Loader from "@/components/ui/custom/Loader";
import DataMessage from "@/components/ui/custom/DataMessage";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useGetUsersQuery } from "@/services/store/features/user.ts";
import { isUserInRole, USER_ROLES, type UserRole } from "@/constants/roles.ts";
import { ROUTES } from "@/constants/routes.ts";
import { PencilIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const UserRow = ({ user }: { user: UserType }) => {
  const navigate = useNavigate();
  const editPath =
    user.id != null
      ? ROUTES.ADMIN_USER_EDIT.replace(":userId", String(user.id))
      : null;

  return (
    <TableRow
      className={editPath ? "cursor-pointer" : undefined}
      onClick={() => editPath && navigate(editPath)}
    >
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="text-muted-foreground">{user.department}</TableCell>
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
          <Button variant="outline" size="sm" asChild>
            <Link to={editPath}>
              <PencilIcon />
              Редактировать
            </Link>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

function Users(): JSX.Element {
  const { data, error, isLoading } = useGetUsersQuery("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<UsersTab>("users");

  const filteredData = useFiltered(filterByTab(data ?? [], activeTab), search);
  const hasSearch = search.trim().length > 0;

  return (
    <>
      <div className="sticky mt-10">
        <Card>
          <CardContent>
            <FieldGroup className="flex flex-row justify-between">
              <Field className="w-1/4">
                <Select
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as UsersTab)}
                >
                  <SelectTrigger id="users-role" className="w-full">
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
              <Field className="w-2/4">
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="users-search"
                    placeholder="Имя, отдел, роль..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {hasSearch && (
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label="Очистить поиск"
                        onClick={() => setSearch("")}
                      >
                        <XIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

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
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {hasSearch ? (
                    <p className="text-sm text-muted-foreground">
                      Пользователь «{search}» не найден
                    </p>
                  ) : (
                    (() => {
                      const tabConfig = TABS[activeTab];
                      return "role" in tabConfig ? (
                        <p className="text-sm text-muted-foreground">
                          Нет пользователей с ролью «{tabConfig.label}»
                        </p>
                      ) : (
                        <DataMessage type="noData" />
                      );
                    })()
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((user) => <UserRow key={user.id} user={user} />)
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Users;
