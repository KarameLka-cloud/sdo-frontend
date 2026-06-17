import { JSX, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataMessage from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import {
  useDeleteAdaptationPlanMutation,
  useGetAdaptationPlansQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
} from "@/services/store/features/user.ts";
import { ROUTES } from "@/constants/routes.ts";
import { useUser } from "@/hooks/useUser.ts";
import { UserType } from "@/interfaces/api/UserType.ts";
import { hasRole, isUserInRole, USER_ROLES } from "@/constants/roles.ts";
import { MoreHorizontalIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdaptationPlan {
  id: number;
  user_id: number;
  start_date?: string;
  mentor: number;
  department_head: number;
  work_schedule?: string;
  template?: { name?: string; work_schedule?: string };
  mentor_user?: { name?: string };
  department_head_user?: { name?: string };
  user?: { name?: string; department?: string };
}

const resolveRoleUsers = (
  fromApi: UserType[] | undefined,
  allUsers: UserType[],
  role: (typeof USER_ROLES)[keyof typeof USER_ROLES],
) => {
  const list = (fromApi ?? []) as UserType[];
  return list.length
    ? list
    : allUsers.filter((user) => isUserInRole(user, role));
};

const buildNameLookup = (users: UserType[]) =>
  new Map(
    users
      .filter((user) => user.id != null)
      .map((user) => [user.id!, user.name ?? ""]),
  );

const getPersonName = (
  embedded: { name?: string } | undefined,
  id: number,
  lookup: Map<number, string>,
) => embedded?.name ?? lookup.get(id) ?? "Не назначен";

const filterVisiblePlans = (
  plans: AdaptationPlan[],
  isAdmin: boolean,
  currentUserId?: number,
) => {
  if (isAdmin) return plans;
  if (!currentUserId) return [];
  return plans.filter(
    (plan) =>
      plan.mentor === currentUserId || plan.department_head === currentUserId,
  );
};

const filterBySearch = (
  plans: AdaptationPlan[],
  search: string,
  mentorNames: Map<number, string>,
  headNames: Map<number, string>,
) => {
  const query = search.trim().toLowerCase();
  if (!query) return plans;

  return plans.filter((plan) => {
    const values = [
      plan.user?.name,
      plan.user?.department,
      plan.template?.name,
      getPersonName(plan.mentor_user, plan.mentor, mentorNames),
      getPersonName(plan.department_head_user, plan.department_head, headNames),
      plan.user_id,
    ];

    return values.some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(query),
    );
  });
};

const InternRow = ({
  plan,
  mentorName,
  headName,
}: {
  plan: AdaptationPlan;
  mentorName: string;
  headName: string;
}) => {
  const navigate = useNavigate();
  const [deletePlan, { isLoading: isDeleting }] =
    useDeleteAdaptationPlanMutation();
  const editPath = ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT.replace(
    ":planId",
    String(plan.id),
  );

  const handleDelete = async () => {
    const confirmed = window.confirm("Удалить план стажера?");
    if (!confirmed) return;

    try {
      await deletePlan(plan.id).unwrap();
      toast.success("План стажера удалён");
    } catch {
      toast.error("Не удалось удалить план");
    }
  };

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => navigate(editPath)}
    >
      <TableCell className="font-medium">
        {plan.user?.name ?? "Пользователь без имени"}
      </TableCell>
      <TableCell>{mentorName}</TableCell>
      <TableCell>{headName}</TableCell>
      <TableCell
        className="text-right"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={isDeleting}
            >
              <MoreHorizontalIcon />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto min-w-max">
            <DropdownMenuItem onClick={() => navigate(editPath)}>
              <PencilIcon />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <TrashIcon />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

function Interns(): JSX.Element {
  const {
    data: plansData,
    isLoading,
    isError,
  } = useGetAdaptationPlansQuery(undefined);
  const { data: usersData } = useGetUsersQuery(undefined);
  const { data: mentorsData } = useGetMentorsQuery(undefined);
  const { data: departmentHeadsData } = useGetDepartmentHeadsQuery(undefined);
  const { role, role_name: roleName, id: currentUserId } = useUser();

  const [search, setSearch] = useState("");

  const adaptationPlans = (plansData ?? []) as AdaptationPlan[];
  const users = (usersData ?? []) as UserType[];
  const mentors = resolveRoleUsers(mentorsData, users, USER_ROLES.MENTOR);
  const departmentHeads = resolveRoleUsers(
    departmentHeadsData,
    users,
    USER_ROLES.DEPARTMENT_HEAD,
  );
  const mentorNames = buildNameLookup(mentors);
  const headNames = buildNameLookup(departmentHeads);
  const isAdmin = hasRole(role, roleName, USER_ROLES.ADMIN);

  const visiblePlans = filterVisiblePlans(
    adaptationPlans,
    isAdmin,
    currentUserId,
  );
  const filteredPlans = filterBySearch(
    visiblePlans,
    search,
    mentorNames,
    headNames,
  );
  const hasSearch = search.trim().length > 0;

  return (
    <>
      <div className="sticky mt-10">
        <Card>
          <CardContent>
            <FieldGroup className="flex flex-row items-end justify-between gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to={ROUTES.MENTORSHIP_INTERNS_PLAN_CREATE}>
                  <PlusIcon />
                  Создать план
                </Link>
              </Button>
              <Field className="w-2/4">
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="interns-search"
                    placeholder="Имя, отдел, наставник, план..."
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

      {isError && <DataMessage type="error" />}
      {isLoading && <Loader />}

      {plansData && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя стажера</TableHead>
              <TableHead>Наставник</TableHead>
              <TableHead>Руководитель</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {hasSearch ? (
                    <p className="text-sm text-muted-foreground">
                      Стажер «{search}» не найден
                    </p>
                  ) : (
                    <DataMessage type="noData" />
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredPlans.map((plan) => (
                <InternRow
                  key={plan.id}
                  plan={plan}
                  mentorName={getPersonName(
                    plan.mentor_user,
                    plan.mentor,
                    mentorNames,
                  )}
                  headName={getPersonName(
                    plan.department_head_user,
                    plan.department_head,
                    headNames,
                  )}
                />
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Interns;
