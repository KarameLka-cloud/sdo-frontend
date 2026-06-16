import { ChangeEvent, JSX, useState } from "react";
import { UserType } from "@/interfaces/api/UserType.ts";
import Loader from "@/components/ui/custom/Loader";
import DataMessage from "@/components/ui/custom/DataMessage";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useGetUsersQuery } from "@/services/store/features/user.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import { isUserInRole, USER_ROLES } from "@/constants/roles.ts";
import { MoreHorizontalIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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

const UserRow = ({ user }: { user: UserType }) => (
  <TableRow>
    <TableCell className="font-medium">{user.name}</TableCell>
    <TableCell>{user.department}</TableCell>
    <TableCell>
      {user.role_name && <Badge variant="destructive">{user.role_name}</Badge>}
    </TableCell>
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

  if (error) return <DataMessage type="error" />;
  if (isLoading) return <Loader />;

  const isEmpty = filteredData.length === 0;
  const hasSearch = search.trim().length > 0;

  return (
    <OverflowScrollBlock>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <Field className="w-full sm:max-w-sm">
          <InputGroup>
            <InputGroupInput
              placeholder="Поиск..."
              type="text"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="w-full p-2.5 shadow-sm"
            />
            <InputGroupAddon align="inline-start">
              <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              {ROLE_LABELS[activeTab]}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {TAB_OPTIONS.map((tab) => (
              <DropdownMenuItem
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearch("");
                }}
                className={activeTab === tab ? "bg-accent" : ""}
              >
                {ROLE_LABELS[tab]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
            <tr>
              <td colSpan={4}>
                {hasSearch ? (
                  <p className="mx-auto mt-4 w-fit py-3 px-4 border border-gray-300 rounded-xl bg-slate-50 text-gray-600 text-center">
                    {ROLE_LABELS[activeTab]} "{search}" не найден(а)
                  </p>
                ) : (
                  <DataMessage type="noData" />
                )}
              </td>
            </tr>
          ) : (
            filteredData.map((user: UserType) => <UserRow key={user.id} user={user} />)
          )}
        </TableBody>
      </Table>
    </OverflowScrollBlock>
  );
}

export default Users;
