import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataMessage, {
  DataStateCenter,
} from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import {
  useDeleteAdaptationPlanMutation,
  useGetAdaptationPlansQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
} from "@/services/store/features/user.ts";
import { useUser } from "@/hooks/useUser.ts";
import { UserType } from "@/interfaces/api/UserType.ts";
import { hasRole, USER_ROLES } from "@/constants/roles.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import AdminListToolbar from "@/pages/Admin/shared/components/AdminListToolbar";
import AdminTableRowActions from "@/pages/Admin/shared/components/AdminTableRowActions";
import AdminTableEmptyRow from "@/pages/Admin/shared/components/AdminTableEmptyRow";
import {
  INTERNSHIP_ROUTES,
  buildEditPath,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminListDelete } from "@/pages/Admin/shared/useAdminListDelete.ts";
import PlanCreateDialog from "@/pages/Mentorship/Interns/PlanCreateDialog";
import { resolveRoleUsers } from "@/utils/resolveRoleUsers.ts";

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

const DELETE_MESSAGES = {
  confirm: "Удалить план стажера?",
  success: "План стажера удалён",
  error: "Не удалось удалить план",
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

function Interns(): JSX.Element {
  const navigate = useNavigate();
  const {
    data: plansData,
    isLoading,
    isError,
  } = useGetAdaptationPlansQuery(undefined);
  const { data: usersData } = useGetUsersQuery(undefined);
  const { data: mentorsData } = useGetMentorsQuery(undefined);
  const { data: departmentHeadsData } = useGetDepartmentHeadsQuery(undefined);
  const { role, role_name: roleName, id: currentUserId } = useUser();
  const deleteMutation = useDeleteAdaptationPlanMutation();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { handleDelete, isDeletingItem } = useAdminListDelete<AdaptationPlan>(
    deleteMutation,
    DELETE_MESSAGES,
  );

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
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminListToolbar
        onCreate={() => setIsCreateOpen(true)}
        createLabel="Создать план"
        searchId="interns-search"
        searchPlaceholder="Имя, отдел, наставник, план..."
        search={search}
        onSearchChange={setSearch}
      />

      {isError && <DataMessage type="error" centered />}
      {isLoading && (
        <DataStateCenter>
          <Loader />
        </DataStateCenter>
      )}

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
              <AdminTableEmptyRow
                colSpan={4}
                hasSearch={hasSearch}
                notFoundMessage={`Стажер «${search}» не найден`}
              />
            ) : (
              filteredPlans.map((plan) => {
                const editPath = buildEditPath(INTERNSHIP_ROUTES.edit, plan.id);

                return (
                  <TableRow
                    key={plan.id}
                    className="cursor-pointer"
                    onClick={() => navigate(editPath)}
                  >
                    <TableCell className="font-medium">
                      {plan.user?.name ?? "Пользователь без имени"}
                    </TableCell>
                    <TableCell>
                      {getPersonName(
                        plan.mentor_user,
                        plan.mentor,
                        mentorNames,
                      )}
                    </TableCell>
                    <TableCell>
                      {getPersonName(
                        plan.department_head_user,
                        plan.department_head,
                        headNames,
                      )}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <AdminTableRowActions
                        editPath={editPath}
                        onDelete={() => handleDelete(plan)}
                        isDeleting={isDeletingItem(plan.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      <PlanCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}

export default Interns;
