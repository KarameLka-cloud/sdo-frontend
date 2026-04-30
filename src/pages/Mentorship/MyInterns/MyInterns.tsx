import { JSX, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import Input from "@components/ui/Input/Input.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import Loader from "@components/ui/Loader/Loader.tsx";
import {
  useGetAdaptationPlansQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
} from "@services/store/features/user.ts";
import { ROUTES } from "@constants/routes.ts";
import { useUser } from "@hooks/useUser.ts";
import { UserType } from "@interfaces/api/UserType.ts";
import { hasRole, isUserInRole, USER_ROLES } from "@constants/roles.ts";
import styles from "./MyInterns.module.css";

interface AdaptationPlanResponse {
  id: number;
  user_id: number;
  mentor: number;
  department_head: number;
  mentor_user?: {
    id?: number;
    name?: string;
  };
  department_head_user?: {
    id?: number;
    name?: string;
  };
  user?: {
    id?: number;
    name?: string;
    department?: string;
  };
}

function MyInterns(): JSX.Element {
  const navigate = useNavigate();
  const { id: currentUserId, role, role_name: roleName } = useUser();
  const [search, setSearch] = useState("");
  const {
    data: adaptationPlansData = [],
    isLoading,
    isError,
  } = useGetAdaptationPlansQuery(undefined);
  const { data: usersData = [] } = useGetUsersQuery(undefined);
  const { data: mentorsData = [] } = useGetMentorsQuery(undefined);
  const { data: departmentHeadsData = [] } = useGetDepartmentHeadsQuery(undefined);

  const adaptationPlans = adaptationPlansData as AdaptationPlanResponse[];
  const users = usersData as UserType[];
  const mentors = (mentorsData as UserType[]).length
    ? (mentorsData as UserType[])
    : users.filter((user) => isUserInRole(user, USER_ROLES.MENTOR));
  const departmentHeads = (departmentHeadsData as UserType[]).length
    ? (departmentHeadsData as UserType[])
    : users.filter((user) => isUserInRole(user, USER_ROLES.DEPARTMENT_HEAD));

  const hasMyInternsAccess =
    hasRole(role, roleName, USER_ROLES.ADMIN) ||
    hasRole(role, roleName, USER_ROLES.MENTOR) ||
    hasRole(role, roleName, USER_ROLES.DEPARTMENT_HEAD);

  const visiblePlans = useMemo(() => {
    if (!hasMyInternsAccess || !currentUserId) {
      return [];
    }

    return adaptationPlans.filter(
      (plan) => plan.mentor === currentUserId || plan.department_head === currentUserId,
    );
  }, [adaptationPlans, currentUserId, hasMyInternsAccess]);

  const hasSearch = search.trim().length > 0;
  const filteredPlans = useMemo(() => {
    if (!hasSearch) {
      return visiblePlans;
    }

    const searchLower = search.toLowerCase();
    return visiblePlans.filter((plan) => {
      const userName = plan.user?.name?.toLowerCase() ?? "";
      const department = plan.user?.department?.toLowerCase() ?? "";
      const userId = String(plan.user_id);

      return (
        userName.includes(searchLower) ||
        department.includes(searchLower) ||
        userId.includes(searchLower)
      );
    });
  }, [hasSearch, search, visiblePlans]);

  return (
    <OverflowScrollBlock header_name={"Список стажеров"}>
      <div className={styles.container}>
        {isLoading && <Loader />}
        {isError && <DataMessage type={"error"} />}
        {!isLoading && !isError && (
          <div className={styles.createSearch}>
            <Input
              type={"text"}
              name={"search"}
              placeholder={"🔎"}
              className={styles.searchInput}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setSearch(e.target.value)
              }
            />
          </div>
        )}
        {!isLoading && !isError && visiblePlans.length === 0 && (
          <DataMessage type={"noData"} />
        )}
        {!isLoading && !isError && visiblePlans.length > 0 && (
          <div className={styles.list}>
            {filteredPlans.map((plan) => (
              <div key={plan.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.name}>
                    {plan.user?.name || "Пользователь без имени"}
                  </div>
                  <div className={styles.iconActions}>
                    <IconButton
                      type="edit"
                      onClick={() =>
                        navigate(
                          ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT.replace(
                            ":planId",
                            String(plan.id),
                          ),
                        )
                      }
                    />
                  </div>
                </div>
                <div className={styles.meta}>ID пользователя: {plan.user_id}</div>
                <div className={styles.actions}>
                  <div className={styles.meta}>
                    Наставник:{" "}
                    {plan.mentor_user?.name ??
                      mentors.find((mentor) => mentor.id === plan.mentor)?.name ??
                      "Не назначен"}
                  </div>
                  <div className={styles.meta}>
                    Руководитель отдела:{" "}
                    {plan.department_head_user?.name ??
                      departmentHeads.find((head) => head.id === plan.department_head)
                        ?.name ??
                      "Не назначен"}
                  </div>
                </div>
              </div>
            ))}
            {hasSearch && filteredPlans.length === 0 && (
              <p className={styles.searchEmpty}>Стажер "{search}" не найден</p>
            )}
          </div>
        )}
      </div>
    </OverflowScrollBlock>
  );
}

export default MyInterns;
