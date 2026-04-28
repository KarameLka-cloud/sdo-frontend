import React, { JSX, useMemo, useState } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import Input from "@components/ui/Input/Input.tsx";
import {
  useCreateAdaptationPlanMutation,
  useDeleteAdaptationPlanMutation,
  useGetAllAdaptationPlansQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
  useUpdateAdaptationPlanMutation,
} from "@services/store/features/user.ts";
import { UserType } from "@interfaces/api/UserType.ts";
import styles from "./Interns.module.css";

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

interface ApiValidationError {
  data?: {
    errors?: {
      user_id?: string[];
    };
  };
}

type CreateStatusType = "idle" | "loading" | "success" | "error";

function Interns(): JSX.Element {
  const [createAdaptationPlan, { isLoading: isCreatingPlan }] =
    useCreateAdaptationPlanMutation();
  const [updateAdaptationPlan, { isLoading: isUpdatingPlan }] =
    useUpdateAdaptationPlanMutation();
  const [deleteAdaptationPlan, { isLoading: isDeletingPlan }] =
    useDeleteAdaptationPlanMutation();
  const {
    data: allAdaptationPlansData = [],
    isLoading: isAllPlansLoading,
    isError: isAllPlansError,
  } = useGetAllAdaptationPlansQuery(undefined);
  const { data: usersData = [] } = useGetUsersQuery(undefined);
  const { data: mentorsData = [] } = useGetMentorsQuery(undefined);
  const { data: departmentHeadsData = [] } = useGetDepartmentHeadsQuery(
    undefined,
  );
  const adaptationPlans = allAdaptationPlansData as AdaptationPlanResponse[];
  const isLoading = isAllPlansLoading;
  const isError = isAllPlansError;
  const users = usersData as UserType[];
  const mentors = (mentorsData as UserType[]).length
    ? (mentorsData as UserType[])
    : users.filter(
        (user) =>
          user.role === "MENTOR" || user.role_name?.toLowerCase() === "наставник",
      );
  const departmentHeads = (departmentHeadsData as UserType[]).length
    ? (departmentHeadsData as UserType[])
    : users.filter(
        (user) =>
          user.role === "DEPARTMENT_HEAD" ||
          user.role_name?.toLowerCase() === "руководитель отдела",
      );
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editMentor, setEditMentor] = useState<number | null>(null);
  const [editDepartmentHead, setEditDepartmentHead] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [newPlan, setNewPlan] = useState({
    userId: null as number | null,
    startDate: "",
    workSchedule: "5/2",
    shift: 1,
    mentor: null as number | null,
    departmentHead: null as number | null,
  });
  const [createStatusType, setCreateStatusType] =
    useState<CreateStatusType>("idle");
  const [createStatusMessage, setCreateStatusMessage] = useState("");
  const visiblePlans = adaptationPlans;
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

  const handleCreatePlan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateStatusType("loading");
    setCreateStatusMessage("Создание...");

    if (!newPlan.userId) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выберите пользователя");
      return;
    }
    if (!newPlan.startDate) {
      setCreateStatusType("error");
      setCreateStatusMessage("Укажите дату начала стажировки");
      return;
    }
    if (!newPlan.mentor) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выберите наставника");
      return;
    }
    if (!newPlan.departmentHead) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выберите руководителя отдела");
      return;
    }

    try {
      await createAdaptationPlan({
        user_id: newPlan.userId,
        start_date: newPlan.startDate,
        work_schedule: newPlan.workSchedule,
        shift: newPlan.shift,
        mentor: newPlan.mentor,
        department_head: newPlan.departmentHead,
      }).unwrap();
      setNewPlan({
        userId: null,
        startDate: "",
        workSchedule: "5/2",
        shift: 1,
        mentor: null,
        departmentHead: null,
      });
      setIsCreateFormVisible(false);
      setCreateStatusType("success");
      setCreateStatusMessage("План создан");
    } catch (error: unknown) {
      const apiError = error as ApiValidationError;
      const duplicatePlanMessage = apiError.data?.errors?.user_id?.[0];
      const message =
        duplicatePlanMessage ||
        "Не удалось сохранить план адаптации. Попробуйте снова.";
      setCreateStatusType("error");
      setCreateStatusMessage(message);
    }
  };

  const handleUpdatePlan = async (
    id: number,
    mentor: number,
    departmentHead: number,
  ) => {
    try {
      await updateAdaptationPlan({
        id,
        mentor,
        department_head: departmentHead,
      }).unwrap();
      setEditingPlanId(null);
    } catch {}
  };

  const startEdit = (plan: AdaptationPlanResponse) => {
    setEditingPlanId(plan.id);
    setEditMentor(plan.mentor);
    setEditDepartmentHead(plan.department_head);
  };

  const closeEdit = () => {
    setEditingPlanId(null);
    setEditMentor(null);
    setEditDepartmentHead(null);
  };

  const handleDeletePlan = async (plan: AdaptationPlanResponse) => {
    const isConfirmed = window.confirm(
      `Удалить стажера "${plan.user?.name || "Без имени"}" из списка?`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteAdaptationPlan(plan.id).unwrap();
      if (editingPlanId === plan.id) {
        closeEdit();
      }
    } catch {}
  };

  return (
    <OverflowScrollBlock header_name={"Список стажеров"}>
      <div className={styles.container}>
        {isLoading && <p className={styles.info}>Загрузка...</p>}
        {isError && <DataMessage type={"error"} />}
        {!isLoading && !isError && (
          <div className={styles.createSearch}>
            {isCreateFormVisible ? (
              <IconButton
                type="close"
                onClick={() => setIsCreateFormVisible(false)}
              />
            ) : (
              <IconButton type="edit" onClick={() => setIsCreateFormVisible(true)} />
            )}
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
        {!isLoading && !isError && isCreateFormVisible && (
          <form className={styles.createForm} onSubmit={handleCreatePlan}>
            <label className={styles.label}>
              Пользователь
              <select
                className={styles.select}
                value={newPlan.userId ?? ""}
                onChange={(e) =>
                  setNewPlan({
                    ...newPlan,
                    userId: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">Выберите пользователя</option>
                {users
                  .filter((user) => user.id !== undefined)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </label>
            <div className={styles.formRow}>
              <label className={styles.label}>
                Дата начала
                <input
                  type="date"
                  className={styles.select}
                  value={newPlan.startDate}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      startDate: e.target.value,
                    })
                  }
                />
              </label>
              <label className={styles.label}>
                График
                <select
                  className={styles.select}
                  value={newPlan.workSchedule}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      workSchedule: e.target.value,
                    })
                  }
                >
                  <option value="5/2">5/2</option>
                  <option value="2/2">2/2</option>
                </select>
              </label>
              <label className={styles.label}>
                Смена
                <select
                  className={styles.select}
                  value={newPlan.shift}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      shift: Number(e.target.value),
                    })
                  }
                >
                  <option value={1}>Смена 1</option>
                  <option value={2}>Смена 2</option>
                  <option value={3}>Смена 3</option>
                  <option value={4}>Смена 4</option>
                  <option value={5}>Смена 5</option>
                  <option value={6}>Смена 6</option>
                </select>
              </label>
            </div>
            <div className={styles.formRow}>
              <label className={styles.label}>
                Наставник
                <select
                  className={styles.select}
                  value={newPlan.mentor ?? ""}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      mentor: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">Выберите наставника</option>
                  {mentors
                    .filter((mentor) => mentor.id !== undefined)
                    .map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className={styles.label}>
                Руководитель отдела
                <select
                  className={styles.select}
                  value={newPlan.departmentHead ?? ""}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      departmentHead: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">Выберите руководителя отдела</option>
                  {departmentHeads
                    .filter((head) => head.id !== undefined)
                    .map((head) => (
                      <option key={head.id} value={head.id}>
                        {head.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.createButton}
                disabled={isCreatingPlan}
              >
                {isCreatingPlan ? "Сохранение..." : "Создать план"}
              </button>
              {createStatusType !== "idle" && (
                <span
                  className={`${styles.createStatus} ${
                    createStatusType === "error"
                      ? styles.createStatusError
                      : createStatusType === "success"
                        ? styles.createStatusSuccess
                        : styles.createStatusLoading
                  }`}
                >
                  {createStatusMessage}
                </span>
              )}
            </div>
          </form>
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
                    {editingPlanId === plan.id ? (
                      <>
                        <IconButton
                          type="save"
                          onClick={() => {
                            if (editMentor && editDepartmentHead) {
                              handleUpdatePlan(plan.id, editMentor, editDepartmentHead);
                            }
                          }}
                        />
                        <IconButton
                          type="delete"
                          onClick={() => handleDeletePlan(plan)}
                        />
                        <IconButton type="close" onClick={closeEdit} />
                      </>
                    ) : (
                      <IconButton type="edit" onClick={() => startEdit(plan)} />
                    )}
                  </div>
                </div>
                <div className={styles.meta}>ID пользователя: {plan.user_id}</div>
                {editingPlanId === plan.id ? (
                  <div className={styles.actions}>
                    <label className={styles.label}>
                      Наставник
                      <select
                        className={styles.select}
                        value={editMentor ?? ""}
                        onChange={(e) =>
                          setEditMentor(e.target.value ? Number(e.target.value) : null)
                        }
                        disabled={isUpdatingPlan || isDeletingPlan}
                      >
                        <option value="">Выберите наставника</option>
                        {mentors
                          .filter((mentor) => mentor.id !== undefined)
                          .map((mentor) => (
                            <option key={mentor.id} value={mentor.id}>
                              {mentor.name}
                            </option>
                          ))}
                      </select>
                    </label>
                    <label className={styles.label}>
                      Руководитель отдела
                      <select
                        className={styles.select}
                        value={editDepartmentHead ?? ""}
                        onChange={(e) =>
                          setEditDepartmentHead(
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                        disabled={isUpdatingPlan || isDeletingPlan}
                      >
                        <option value="">Выберите руководителя отдела</option>
                        {departmentHeads
                          .filter((head) => head.id !== undefined)
                          .map((head) => (
                            <option key={head.id} value={head.id}>
                              {head.name}
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>
                ) : (
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
                )}
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

export default Interns;
