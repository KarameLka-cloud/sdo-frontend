import { JSX, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteAdaptationPlanMutation,
  useGetAdaptationPlansQuery,
} from "@/services/store/features/adaptation.ts";
import {
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
} from "@/services/store/features/users.ts";
import { useUser } from "@/hooks/useUser.ts";
import { UserType } from "@/interfaces/api/UserType.ts";
import { hasRole, USER_ROLES } from "@/constants/roles.ts";
import ResourceListPage, {
  type ResourceColumn,
} from "@/components/resource-list/ResourceListPage";
import ResourceTableRowActions from "@/components/resource-list/ResourceTableRowActions";
import {
  INTERNSHIP_ROUTES,
  buildEditPath,
} from "@/components/resource-list/resourceRoutes";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import PlanCreateDialog from "@/pages/Mentorship/Interns/PlanCreateDialog";
import type { AdaptationPlanType } from "@/interfaces/api/AdaptationPlanType.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { PLAN_DELETE_MESSAGES } from "@/constants/deleteMessages.ts";

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

function Interns(): JSX.Element {
  const navigate = useNavigate();
  const {
    data: plansData,
    isLoading,
    isError,
  } = useGetAdaptationPlansQuery(undefined);
  const { data: mentorsData } = useGetMentorsQuery(undefined);
  const { data: departmentHeadsData } = useGetDepartmentHeadsQuery(undefined);
  const { role, role_name: roleName, id: currentUserId } = useUser();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { handleDelete, isDeletingItem } = useConfirmDelete(
    useDeleteAdaptationPlanMutation(),
    { messages: PLAN_DELETE_MESSAGES },
  );

  const isAdmin = hasRole(role, roleName, USER_ROLES.ADMIN);

  // Only a fallback: plans already embed mentor and head records.
  const { mentorNames, headNames } = useMemo(
    () => ({
      mentorNames: buildNameLookup(mentorsData ?? []),
      headNames: buildNameLookup(departmentHeadsData ?? []),
    }),
    [mentorsData, departmentHeadsData],
  );

  const visiblePlans = useMemo(() => {
    const plans = plansData ?? [];
    if (isAdmin) return plans;
    if (!currentUserId) return [];
    return plans.filter(
      (plan) =>
        plan.mentor === currentUserId || plan.department_head === currentUserId,
    );
  }, [plansData, isAdmin, currentUserId]);

  const getSearchText = useCallback(
    (plan: AdaptationPlanType) =>
      [
        plan.user?.name,
        plan.user?.department,
        plan.template?.name,
        getPersonName(plan.mentor_user, plan.mentor, mentorNames),
        getPersonName(
          plan.department_head_user,
          plan.department_head,
          headNames,
        ),
        plan.user_id,
      ]
        .map((value) => String(value ?? ""))
        .join(" "),
    [mentorNames, headNames],
  );

  const filteredPlans = useFiltered(visiblePlans, search, getSearchText);

  const columns = useMemo<ResourceColumn<AdaptationPlanType>[]>(
    () => [
      {
        key: "intern",
        label: "Имя стажера",
        className: "font-medium",
        render: (plan) => plan.user?.name ?? "Пользователь без имени",
      },
      {
        key: "mentor",
        label: "Наставник",
        render: (plan) =>
          getPersonName(plan.mentor_user, plan.mentor, mentorNames),
      },
      {
        key: "department_head",
        label: "Руководитель",
        render: (plan) =>
          getPersonName(
            plan.department_head_user,
            plan.department_head,
            headNames,
          ),
      },
    ],
    [mentorNames, headNames],
  );

  return (
    <ResourceListPage
      searchId="interns-search"
      searchPlaceholder="Имя, отдел, наставник, план..."
      search={search}
      onSearchChange={setSearch}
      onCreate={() => setIsCreateOpen(true)}
      createLabel="Создать план"
      isLoading={isLoading}
      isError={isError}
      hasData={Boolean(plansData)}
      items={filteredPlans}
      columns={columns}
      getRowKey={(plan) => plan.id}
      onRowClick={(plan) =>
        navigate(buildEditPath(INTERNSHIP_ROUTES.edit, plan.id))
      }
      renderActions={(plan) => (
        <ResourceTableRowActions
          editPath={buildEditPath(INTERNSHIP_ROUTES.edit, plan.id)}
          onDelete={() => handleDelete(plan)}
          isDeleting={isDeletingItem(plan.id)}
        />
      )}
      notFoundMessage={`Стажер «${search}» не найден`}
    >
      <PlanCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </ResourceListPage>
  );
}

export default Interns;
