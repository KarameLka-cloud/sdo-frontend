import { JSX, useState } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import {
  useDeleteAdaptationPlanMutation,
  useGetAdaptationPlansQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
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

function Interns(): JSX.Element {
  const [updateAdaptationPlan, { isLoading: isUpdatingPlan }] =
    useUpdateAdaptationPlanMutation();
  const [deleteAdaptationPlan, { isLoading: isDeletingPlan }] =
    useDeleteAdaptationPlanMutation();
  const { data: adaptationPlansData = [], isLoading, isError } =
    useGetAdaptationPlansQuery(undefined);
  const { data: mentorsData = [] } = useGetMentorsQuery(undefined);
  const { data: departmentHeadsData = [] } = useGetDepartmentHeadsQuery(
    undefined,
  );
  const adaptationPlans = adaptationPlansData as AdaptationPlanResponse[];
  const mentors = mentorsData as UserType[];
  const departmentHeads = departmentHeadsData as UserType[];
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editMentor, setEditMentor] = useState<number | null>(null);
  const [editDepartmentHead, setEditDepartmentHead] = useState<number | null>(null);

  const handleUpdatePlan = async (
    id: number,
    mentor: number,
    departmentHead: number,
  ) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await updateAdaptationPlan({
        id,
        mentor,
        department_head: departmentHead,
      }).unwrap();
      setSuccessMessage("Данные стажера обновлены.");
      setEditingPlanId(null);
    } catch {
      setErrorMessage("Не удалось обновить данные стажера.");
    }
  };

  const handleDeletePlan = async (id: number) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await deleteAdaptationPlan(id).unwrap();
      setSuccessMessage("Стажер удален из списка.");
    } catch {
      setErrorMessage("Не удалось удалить стажера.");
    }
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

  return (
    <OverflowScrollBlock header_name={"Список стажеров"}>
      <div className={styles.container}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {isLoading && <p className={styles.info}>Загрузка...</p>}
        {isError && <DataMessage type={"error"} />}
        {!isLoading && !isError && adaptationPlans.length === 0 && (
          <DataMessage type={"noData"} />
        )}
        {!isLoading && !isError && adaptationPlans.length > 0 && (
          <div className={styles.list}>
            {adaptationPlans.map((plan) => (
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
                        <IconButton type="close" onClick={closeEdit} />
                      </>
                    ) : (
                      <IconButton type="edit" onClick={() => startEdit(plan)} />
                    )}
                    <IconButton
                      type="delete"
                      onClick={() => handleDeletePlan(plan.id)}
                    />
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
          </div>
        )}
      </div>
    </OverflowScrollBlock>
  );
}

export default Interns;
