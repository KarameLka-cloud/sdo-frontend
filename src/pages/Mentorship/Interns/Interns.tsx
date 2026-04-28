import React, { JSX, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import Input from "@components/ui/Input/Input.tsx";
import {
  useCreateAdaptationPlanMutation,
  useDeleteAdaptationPlanMutation,
  useGetAdaptationPlanTemplatesQuery,
  useGetAllAdaptationPlansQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
  useUpdateAdaptationPlanMutation,
} from "@services/store/features/user.ts";
import { ROUTES } from "@constants/routes.ts";
import { UserType } from "@interfaces/api/UserType.ts";
import { isUserInRole, USER_ROLES } from "@constants/roles.ts";
import styles from "./Interns.module.css";

interface AdaptationPlanResponse {
  id: number;
  user_id: number;
  start_date?: string;
  adaptation_plan_template_id?: number | null;
  mentor: number;
  department_head: number;
  work_schedule?: string;
  shift?: number;
  template?: {
    id: number;
    name: string;
    work_schedule: string;
    shifts: number[];
  };
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
  days?: Array<{
    id: number;
    work_day: number;
    date: string;
    completion: "в процессе" | "выполнен" | "есть замечания";
    tasks?: Array<{
      id: number;
      description: string;
      status: "выполнено" | "не выполнено";
    }>;
  }>;
}

interface ApiValidationError {
  data?: {
    message?: string;
    errors?: {
      user_id?: string[];
      [key: string]: string[] | undefined;
    };
  };
  status?: number;
}

type CreateStatusType = "idle" | "loading" | "success" | "error";

const FALLBACK_ACTION_ERROR = "Не удалось выполнить действие. Попробуйте снова.";

function getErrorMessage(error: unknown, fallback = FALLBACK_ACTION_ERROR): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const apiError = error as ApiValidationError;
    const duplicatePlanMessage = apiError.data?.errors?.user_id?.[0];
    if (duplicatePlanMessage) {
      return duplicatePlanMessage;
    }

    const firstValidationError = Object.values(apiError.data?.errors ?? {}).find(
      (messages) => Array.isArray(messages) && messages.length > 0,
    )?.[0];
    if (firstValidationError) {
      return firstValidationError;
    }

    if (apiError.status === 403) {
      return "Недостаточно прав для этого действия.";
    }

    if (apiError.data?.message) {
      return apiError.data.message;
    }
  }
  return fallback;
}

function Interns(): JSX.Element {
  const navigate = useNavigate();
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
  const { data: templatesData = [] } = useGetAdaptationPlanTemplatesQuery(undefined);
  const { data: mentorsData = [] } = useGetMentorsQuery(undefined);
  const { data: departmentHeadsData = [] } = useGetDepartmentHeadsQuery(
    undefined,
  );
  const adaptationPlans = allAdaptationPlansData as AdaptationPlanResponse[];
  const isLoading = isAllPlansLoading;
  const isError = isAllPlansError;
  const users = usersData as UserType[];
  const adaptationTemplates = templatesData as {
    id: number;
    name: string;
    work_schedule: string;
    shifts: number[];
  }[];
  const mentors = (mentorsData as UserType[]).length
    ? (mentorsData as UserType[])
    : users.filter((user) => isUserInRole(user, USER_ROLES.MENTOR));
  const departmentHeads = (departmentHeadsData as UserType[]).length
    ? (departmentHeadsData as UserType[])
    : users.filter((user) => isUserInRole(user, USER_ROLES.DEPARTMENT_HEAD));
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editMentor, setEditMentor] = useState<number | null>(null);
  const [editDepartmentHead, setEditDepartmentHead] = useState<number | null>(null);
  const [editTemplateId, setEditTemplateId] = useState<number | null>(null);
  const [editShift, setEditShift] = useState<number>(1);
  const [editStartDate, setEditStartDate] = useState<string>("");
  const [search, setSearch] = useState("");
  const [newPlan, setNewPlan] = useState({
    userId: null as number | null,
    startDate: "",
    adaptationPlanTemplateId: null as number | null,
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
    if (!newPlan.adaptationPlanTemplateId) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выберите шаблон адаптации");
      return;
    }
    const template = adaptationTemplates.find(
      (item) => item.id === newPlan.adaptationPlanTemplateId,
    );
    if (!template) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выбранный шаблон не найден");
      return;
    }
    if (!template.shifts.includes(newPlan.shift)) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выберите корректную смену из шаблона");
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
        adaptation_plan_template_id: newPlan.adaptationPlanTemplateId,
        shift: newPlan.shift,
        mentor: newPlan.mentor,
        department_head: newPlan.departmentHead,
      }).unwrap();
      setNewPlan({
        userId: null,
        startDate: "",
        adaptationPlanTemplateId: null,
        shift: 1,
        mentor: null,
        departmentHead: null,
      });
      setCreateStatusType("success");
      setCreateStatusMessage("План создан");
    } catch (error: unknown) {
      setCreateStatusType("error");
      setCreateStatusMessage(
        getErrorMessage(error, "Не удалось сохранить план адаптации. Попробуйте снова."),
      );
    }
  };

  const handleUpdatePlan = async (
    id: number,
    mentor: number,
    departmentHead: number,
    adaptationPlanTemplateId: number,
    shift: number,
    startDate: string,
  ) => {
    const template = adaptationTemplates.find((item) => item.id === adaptationPlanTemplateId);
    if (!template) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выбранный шаблон не найден");
      return;
    }
    if (!template.shifts.includes(shift)) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выберите корректную смену из шаблона");
      return;
    }

    try {
      await updateAdaptationPlan({
        id,
        start_date: startDate,
        adaptation_plan_template_id: adaptationPlanTemplateId,
        shift,
        mentor,
        department_head: departmentHead,
      }).unwrap();
      setEditingPlanId(null);
    } catch (error: unknown) {
      setCreateStatusType("error");
      setCreateStatusMessage(getErrorMessage(error));
    }
  };

  const startEdit = (plan: AdaptationPlanResponse) => {
    setEditingPlanId(plan.id);
    setEditMentor(plan.mentor);
    setEditDepartmentHead(plan.department_head);
    setEditTemplateId(plan.adaptation_plan_template_id ?? plan.template?.id ?? null);
    setEditShift(plan.shift ?? 1);
    setEditStartDate(plan.start_date ?? "");
  };

  const closeEdit = () => {
    setEditingPlanId(null);
    setEditMentor(null);
    setEditDepartmentHead(null);
    setEditTemplateId(null);
    setEditShift(1);
    setEditStartDate("");
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
    } catch (error: unknown) {
      setCreateStatusType("error");
      setCreateStatusMessage(getErrorMessage(error));
    }
  };

  const selectedCreateTemplate = adaptationTemplates.find(
    (template) => template.id === newPlan.adaptationPlanTemplateId,
  );

  const availableCreateShifts = selectedCreateTemplate?.shifts?.length
    ? selectedCreateTemplate.shifts
    : [1, 2, 3, 4, 5, 6];

  const selectedEditTemplate = adaptationTemplates.find(
    (template) => template.id === editTemplateId,
  );

  const availableEditShifts = selectedEditTemplate?.shifts?.length
    ? selectedEditTemplate.shifts
    : [1, 2, 3, 4, 5, 6];

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
                Шаблон адаптации
                <select
                  className={styles.select}
                  value={newPlan.adaptationPlanTemplateId ?? ""}
                  onChange={(e) => {
                    const templateId = e.target.value ? Number(e.target.value) : null;
                    const template = adaptationTemplates.find(
                      (item) => item.id === templateId,
                    );
                    setNewPlan({
                      ...newPlan,
                      adaptationPlanTemplateId: templateId,
                      shift: template?.shifts?.[0] ?? 1,
                    });
                  }}
                >
                  <option value="">Выберите шаблон</option>
                  {adaptationTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.work_schedule})
                    </option>
                  ))}
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
                  {availableCreateShifts.map((shift) => (
                    <option key={shift} value={shift}>
                      Смена {shift}
                    </option>
                  ))}
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
                            if (
                              editMentor &&
                              editDepartmentHead &&
                              editTemplateId &&
                              editStartDate
                            ) {
                              handleUpdatePlan(
                                plan.id,
                                editMentor,
                                editDepartmentHead,
                                editTemplateId,
                                editShift,
                                editStartDate,
                              );
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
                {plan.template && (
                  <div className={styles.meta}>
                    Шаблон: {plan.template.name} ({plan.template.work_schedule})
                  </div>
                )}
                {editingPlanId === plan.id ? (
                  <div className={styles.actions}>
                    <label className={styles.label}>
                      Дата начала
                      <input
                        type="date"
                        className={styles.select}
                        value={editStartDate}
                        onChange={(e) => setEditStartDate(e.target.value)}
                        disabled={isUpdatingPlan || isDeletingPlan}
                      />
                    </label>
                    <label className={styles.label}>
                      Шаблон адаптации
                      <select
                        className={styles.select}
                        value={editTemplateId ?? ""}
                        onChange={(e) => {
                          const templateId = e.target.value ? Number(e.target.value) : null;
                          const template = adaptationTemplates.find(
                            (item) => item.id === templateId,
                          );
                          setEditTemplateId(templateId);
                          setEditShift(template?.shifts?.[0] ?? 1);
                        }}
                        disabled={isUpdatingPlan || isDeletingPlan}
                      >
                        <option value="">Выберите шаблон</option>
                        {adaptationTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} ({template.work_schedule})
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={styles.label}>
                      Смена
                      <select
                        className={styles.select}
                        value={editShift}
                        onChange={(e) => setEditShift(Number(e.target.value))}
                        disabled={isUpdatingPlan || isDeletingPlan}
                      >
                        {availableEditShifts.map((shift) => (
                          <option key={shift} value={shift}>
                            Смена {shift}
                          </option>
                        ))}
                      </select>
                    </label>
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
                    <button
                      type="button"
                      className={styles.openEditorButton}
                      onClick={() =>
                        navigate(
                          ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT.replace(
                            ":planId",
                            String(plan.id),
                          ),
                        )
                      }
                    >
                      Редактировать план подробно
                    </button>
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
