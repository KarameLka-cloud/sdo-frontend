import { ChangeEvent, FormEvent, JSX, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import Input from "@components/ui/Input/Input.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import Loader from "@components/ui/Loader/Loader.tsx";
import {
  useCreateAdaptationPlanMutation,
  useGetAdaptationPlanTemplatesQuery,
  useGetAdaptationPlansQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
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
  const {
    data: allAdaptationPlansData = [],
    isLoading: isAllPlansLoading,
    isError: isAllPlansError,
  } = useGetAdaptationPlansQuery(undefined);
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
  const [search, setSearch] = useState("");
  const [newPlan, setNewPlan] = useState({
    userId: null as number | null,
    startDate: "",
    workSchedule: "",
    adaptationPlanTemplateId: null as number | null,
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

  const handleCreatePlan = async (event: FormEvent<HTMLFormElement>) => {
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
    if (!newPlan.workSchedule) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выберите режим работы");
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
    if (template.work_schedule !== newPlan.workSchedule) {
      setCreateStatusType("error");
      setCreateStatusMessage("Выберите шаблон с подходящим режимом работы");
      return;
    }
    const selectedShift = [...template.shifts].sort((a, b) => a - b)[0];
    if (!selectedShift) {
      setCreateStatusType("error");
      setCreateStatusMessage("У выбранного шаблона не найдены смены");
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
        shift: selectedShift,
        mentor: newPlan.mentor,
        department_head: newPlan.departmentHead,
      }).unwrap();
      setNewPlan({
        userId: null,
        startDate: "",
        workSchedule: "",
        adaptationPlanTemplateId: null,
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

  const availableWorkSchedules = Array.from(
    new Set(adaptationTemplates.map((template) => template.work_schedule)),
  );

  const filteredCreateTemplates = newPlan.workSchedule
    ? adaptationTemplates
        .filter((template) => template.work_schedule === newPlan.workSchedule)
        .sort((a, b) => {
          const firstShiftA = Math.min(...a.shifts);
          const firstShiftB = Math.min(...b.shifts);
          if (firstShiftA !== firstShiftB) {
            return firstShiftA - firstShiftB;
          }
          return a.name.localeCompare(b.name, "ru");
        })
    : [];

  return (
    <OverflowScrollBlock header_name={"Список стажеров"}>
      <div className={styles.container}>
        {isLoading && <Loader />}
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
              onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                setSearch(e.target.value)
              }
            />
          </div>
        )}
        {!isLoading && !isError && isCreateFormVisible && (
          <form className={styles.createForm} onSubmit={handleCreatePlan}>
            <div className={styles.field}>
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
                <option value="" disabled>
                  Пользователь
                </option>
                {users
                  .filter((user) => user.id !== undefined)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <Input
                  type="date"
                  name="startDate"
                  className={styles.dateInput}
                  placeholder="Дата начала"
                  value={newPlan.startDate}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.field}>
                <select
                  className={styles.select}
                  value={newPlan.workSchedule}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      workSchedule: e.target.value,
                      adaptationPlanTemplateId: null,
                    })
                  }
                >
                  <option value="" disabled>
                    Режим работы
                  </option>
                  {availableWorkSchedules.map((schedule) => (
                    <option key={schedule} value={schedule}>
                      {schedule}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <select
                  className={styles.select}
                  value={newPlan.adaptationPlanTemplateId ?? ""}
                  onChange={(e) => {
                    const templateId = e.target.value ? Number(e.target.value) : null;
                    setNewPlan({
                      ...newPlan,
                      adaptationPlanTemplateId: templateId,
                    });
                  }}
                  disabled={!newPlan.workSchedule}
                >
                  <option value="" disabled>
                    Шаблон адаптации
                  </option>
                  {filteredCreateTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} (смены: {[...template.shifts].sort((a, b) => a - b).join(", ")})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
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
                  <option value="" disabled>
                    Наставник
                  </option>
                  {mentors
                    .filter((mentor) => mentor.id !== undefined)
                    .map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.field}>
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
                  <option value="" disabled>
                    Руководитель отдела
                  </option>
                  {departmentHeads
                    .filter((head) => head.id !== undefined)
                    .map((head) => (
                      <option key={head.id} value={head.id}>
                        {head.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className={styles.formActions}>
              <ButtonSubmit loading={isCreatingPlan} className={styles.submitButton}>
                Создать
              </ButtonSubmit>
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
                {plan.template && (
                  <div className={styles.meta}>
                    Шаблон: {plan.template.name} ({plan.template.work_schedule})
                  </div>
                )}
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

export default Interns;
