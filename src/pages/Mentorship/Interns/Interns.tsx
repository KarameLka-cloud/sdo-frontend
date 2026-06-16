import { JSX, useState } from "react";
import { Link } from "react-router-dom";
import DataMessage from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import {
  useGetAdaptationPlansQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
} from "@/services/store/features/user.ts";
import { ROUTES } from "@/constants/routes.ts";
import { useUser } from "@/hooks/useUser.ts";
import { UserType } from "@/interfaces/api/UserType.ts";
import { hasRole, isUserInRole, USER_ROLES } from "@/constants/roles.ts";
import convertDate from "@/utils/convertDate.ts";
import { PencilIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
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

const ALL_SCHEDULES = "all";

const getWorkSchedule = (plan: AdaptationPlan) =>
  plan.template?.work_schedule ?? plan.work_schedule ?? "";

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

const filterBySchedule = (plans: AdaptationPlan[], schedule: string) =>
  schedule === ALL_SCHEDULES
    ? plans
    : plans.filter((plan) => getWorkSchedule(plan) === schedule);

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
  const schedule = getWorkSchedule(plan);

  return (
    <TableRow>
      <TableCell className="font-medium">
        {plan.user?.name ?? "Пользователь без имени"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {plan.user?.department ?? "—"}
      </TableCell>
      <TableCell>{convertDate(plan.start_date)}</TableCell>
      <TableCell>
        {plan.template?.name ?? "—"}
        {schedule && (
          <span className="text-muted-foreground"> ({schedule})</span>
        )}
      </TableCell>
      <TableCell>{mentorName}</TableCell>
      <TableCell>{headName}</TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" asChild>
          <Link
            to={ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT.replace(
              ":planId",
              String(plan.id),
            )}
          >
            <PencilIcon />
            Редактировать
          </Link>
        </Button>
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
  const [scheduleFilter, setScheduleFilter] = useState(ALL_SCHEDULES);

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
    filterBySchedule(visiblePlans, scheduleFilter),
    search,
    mentorNames,
    headNames,
  );
  const hasSearch = search.trim().length > 0;
  const workScheduleOptions = [
    ...new Set(visiblePlans.map(getWorkSchedule).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "ru"));

  return (
    <>
      <div className="sticky mt-10">
        <Card>
          <CardContent>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="interns-search">Поиск</FieldLabel>
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
              <Field>
                <FieldLabel htmlFor="interns-schedule">Режим работы</FieldLabel>
                <Select
                  value={scheduleFilter}
                  onValueChange={setScheduleFilter}
                >
                  <SelectTrigger id="interns-schedule" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_SCHEDULES}>
                      Все режимы работы
                    </SelectItem>
                    {workScheduleOptions.map((schedule) => (
                      <SelectItem key={schedule} value={schedule}>
                        {schedule}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link to={ROUTES.MENTORSHIP_INTERNS_PLAN_CREATE}>
                  <PlusIcon />
                  Создать план
                </Link>
              </Button>
            </div>
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
              <TableHead>Отдел</TableHead>
              <TableHead>Дата начала</TableHead>
              <TableHead>План адаптации</TableHead>
              <TableHead>Наставник</TableHead>
              <TableHead>Руководитель</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {hasSearch ? (
                    <p className="text-sm text-muted-foreground">
                      Стажер «{search}» не найден
                    </p>
                  ) : scheduleFilter !== ALL_SCHEDULES ? (
                    <p className="text-sm text-muted-foreground">
                      Нет стажеров с режимом работы «{scheduleFilter}»
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
