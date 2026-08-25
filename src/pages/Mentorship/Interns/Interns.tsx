import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import ResourceListToolbar from "@/components/resource-list/ResourceListToolbar";
import ResourceTableRowActions from "@/components/resource-list/ResourceTableRowActions";
import ResourceTableEmptyRow from "@/components/resource-list/ResourceTableEmptyRow";
import QueryState from "@/components/resource-list/QueryState";
import {
  INTERNSHIP_ROUTES,
  buildEditPath,
} from "@/components/resource-list/resourceRoutes";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import PlanCreateDialog from "@/pages/Mentorship/Interns/PlanCreateDialog";
import { resolveRoleUsers } from "@/utils/resolveRoleUsers.ts";
import type { AdaptationPlanType } from "@/interfaces/api/AdaptationPlanType.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";

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
  plans: AdaptationPlanType[],
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
  const { handleDelete, isDeletingItem } = useConfirmDelete(deleteMutation, {
    messages: DELETE_MESSAGES,
  });

  const adaptationPlans = plansData ?? [];
  const users = usersData ?? [];
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
  const filteredPlans = useFiltered(visiblePlans, search, (plan) =>
    [
      plan.user?.name,
      plan.user?.department,
      plan.template?.name,
      getPersonName(plan.mentor_user, plan.mentor, mentorNames),
      getPersonName(plan.department_head_user, plan.department_head, headNames),
      plan.user_id,
    ]
      .map((value) => String(value ?? ""))
      .join(" "),
  );
  const hasSearch = search.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ResourceListToolbar
        onCreate={() => setIsCreateOpen(true)}
        createLabel="Создать план"
        searchId="interns-search"
        searchPlaceholder="Имя, отдел, наставник, план..."
        search={search}
        onSearchChange={setSearch}
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        hasData={Boolean(plansData)}
      >
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
              <ResourceTableEmptyRow
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
                      <ResourceTableRowActions
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
      </QueryState>

      <PlanCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}

export default Interns;
