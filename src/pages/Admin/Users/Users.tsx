import { ChangeEvent, JSX, useState } from "react";
import { Link } from "react-router-dom";
import { UserType } from "@/interfaces/api/UserType.ts";
import Loader from "@/components/ui/custom/Loader";
import DataMessage from "@/components/ui/custom/DataMessage";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useGetUsersQuery } from "@/services/store/features/user.ts";
import { isUserInRole, USER_ROLES } from "@/constants/roles.ts";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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

type UsersTab = "users" | "admins" | "mentors" | "department_heads";

const TAB_OPTIONS: UsersTab[] = [
  "users",
  "admins",
  "department_heads",
  "mentors",
];

const ROLE_LABELS: Record<UsersTab, string> = {
  users: "Все пользователи",
  admins: "Администраторы",
  mentors: "Наставники",
  department_heads: "Руководители отделов",
};

const ROLE_FILTERS: Record<UsersTab, (user: UserType) => boolean> = {
  users: () => true,
  admins: (user) => isUserInRole(user, USER_ROLES.ADMIN),
  mentors: (user) => isUserInRole(user, USER_ROLES.MENTOR),
  department_heads: (user) => isUserInRole(user, USER_ROLES.DEPARTMENT_HEAD),
};

const getUserEditPath = (userId: number): string =>
  ROUTES.ADMIN_USER_EDIT.replace(":userId", String(userId));

const UserRow = ({ user }: { user: UserType }) => (
  <TableRow>
    <TableCell className="font-medium">{user.name}</TableCell>
    <TableCell className="text-muted-foreground">{user.department}</TableCell>
    <TableCell>
      {user.role_name ? (
        <Badge variant="destructive">{user.role_name}</Badge>
      ) : (
        <Badge variant="secondary">Пользователь</Badge>
      )}
    </TableCell>
    <TableCell className="text-right">
      {user.id && (
        <Button variant="outline" size="sm" asChild>
          <Link to={getUserEditPath(user.id)}>
            <PencilIcon />
            Редактировать
          </Link>
        </Button>
      )}
    </TableCell>
  </TableRow>
);

function Users(): JSX.Element {
  const { data, error, isLoading } = useGetUsersQuery("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<UsersTab>("users");

  const users = data || [];
  const filteredByRole = users.filter(ROLE_FILTERS[activeTab]);
  const filteredData = useFiltered(filteredByRole, search);

  const isEmpty = filteredData.length === 0;
  const hasSearch = search.trim().length > 0;
  const hasRoleFilter = activeTab !== "users";

  return (
    <>
      <div className="mt-10 sticky">
        <Card>
          <CardContent>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="users-search">Поиск</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="users-search"
                    placeholder="Имя, отдел, роль..."
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearch(e.target.value)
                    }
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
              <Field>
                <FieldLabel htmlFor="users-role">Роль</FieldLabel>
                <Select
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as UsersTab)}
                >
                  <SelectTrigger id="users-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAB_OPTIONS.map((tab) => (
                      <SelectItem key={tab} value={tab}>
                        {ROLE_LABELS[tab]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
      {error && <DataMessage type="error" />}
      {isLoading && <Loader />}

      {data && (
        <>
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
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {hasSearch ? (
                      <p className="text-sm text-muted-foreground">
                        Пользователь «{search}» не найден
                      </p>
                    ) : hasRoleFilter ? (
                      <p className="text-sm text-muted-foreground">
                        Нет пользователей с ролью «{ROLE_LABELS[activeTab]}»
                      </p>
                    ) : (
                      <DataMessage type="noData" />
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((user: UserType) => (
                  <UserRow key={user.id} user={user} />
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}

export default Users;
