import { JSX, useState } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import { TrainingPlanType, WorkSchedule } from "@interfaces/api/AdaptationDayType.ts";
import { UserType } from "@interfaces/api/UserType.ts";
import {
  useCreateAdaptationPlanMutation,
  useGetUsersQuery,
} from "@services/store/features/user.ts";
import styles from "./Form.module.css";

interface ApiValidationError {
  data?: {
    errors?: {
      user_id?: string[];
    };
  };
}

function Form(): JSX.Element {
  const [createAdaptationPlan, { isLoading: isCreatingPlan }] =
    useCreateAdaptationPlanMutation();
  const { data: usersData = [], isLoading: isUsersLoading } = useGetUsersQuery(
    undefined,
  );
  const users = usersData as UserType[];
  const [formData, setFormData] = useState<TrainingPlanType>({
    userId: null,
    userName: "",
    startDate: "",
    workSchedule: "5/2",
    shift: 1,
    mentor: "",
    departmentHead: "",
  });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmitPlan = async () => {
    setError("");
    setSuccessMessage("");
    if (!formData.userId) {
      setError("Пожалуйста, выберите пользователя");
      return;
    }
    if (!formData.startDate) {
      setError("Пожалуйста, укажите дату начала стажировки");
      return;
    }
    if (!formData.mentor) {
      setError("Пожалуйста, выберите наставника");
      return;
    }
    if (!formData.departmentHead) {
      setError("Пожалуйста, выберите руководителя отдела");
      return;
    }

    try {
      await createAdaptationPlan({
        user_id: formData.userId,
        start_date: formData.startDate,
        work_schedule: formData.workSchedule,
        shift: formData.shift,
        mentor: formData.mentor,
        department_head: formData.departmentHead,
      }).unwrap();
      setSuccessMessage("План адаптации успешно создан.");
      setFormData({
        userId: null,
        userName: "",
        startDate: "",
        workSchedule: "5/2",
        shift: 1,
        mentor: "",
        departmentHead: "",
      });
    } catch (error: unknown) {
      const apiError = error as ApiValidationError;
      const duplicatePlanMessage = apiError.data?.errors?.user_id?.[0];

      if (duplicatePlanMessage) {
        setError(duplicatePlanMessage);
        return;
      }

      setError("Не удалось сохранить план адаптации. Попробуйте снова.");
    }
  };
  return (
    <OverflowScrollBlock header_name={"Карьера"}>
      <div className={styles.trainingPlanForm}>
        <h2 className={styles.formTitle}>Создание плана обучения</h2>
        <p className={styles.formDescription}>
          Заполните информацию для начала создания плана обучения
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Пользователь</label>
          <select
            className={styles.formSelect}
            value={formData.userId ?? ""}
            onChange={(e) => {
              const selectedUserId = Number(e.target.value);
              const selectedUser = users.find((user) => user.id === selectedUserId);

              setFormData({
                ...formData,
                userId: selectedUserId || null,
                userName: selectedUser?.name || "",
              });
            }}
          >
            <option value="">
              {isUsersLoading ? "Загрузка пользователей..." : "Выберите пользователя"}
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

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Дата начала стажировки</label>
          <input
            type="date"
            className={styles.formInput}
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </div>

        <div className={styles.rowGroup}>
          <div className={styles.formGroupHalf}>
            <label className={styles.formLabel}>График работы</label>
            <select
              className={styles.formSelect}
              value={formData.workSchedule}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workSchedule: e.target.value as WorkSchedule,
                })
              }
            >
              <option value="5/2">5/2</option>
              <option value="2/2">2/2</option>
            </select>
          </div>

          <div className={styles.formGroupHalf}>
            <label className={styles.formLabel}>Смена</label>
            <select
              className={styles.formSelect}
              value={formData.shift}
              onChange={(e) =>
                setFormData({ ...formData, shift: parseInt(e.target.value) })
              }
            >
              <option value={1}>Смена 1</option>
              <option value={2}>Смена 2</option>
              <option value={3}>Смена 3</option>
              <option value={4}>Смена 4</option>
              <option value={5}>Смена 5</option>
              <option value={6}>Смена 6</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Наставник</label>
          <select
            className={styles.formSelect}
            value={formData.mentor}
            onChange={(e) =>
              setFormData({ ...formData, mentor: e.target.value })
            }
          >
            <option value="">Выберите наставника</option>
            <option value="Мария Сидорова">Мария Сидорова</option>
            <option value="Алексей Кузнецов">Алексей Кузнецов</option>
            <option value="Олег Никитин">Олег Никитин</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Руководитель отдела</label>
          <select
            className={styles.formSelect}
            value={formData.departmentHead}
            onChange={(e) =>
              setFormData({ ...formData, departmentHead: e.target.value })
            }
          >
            <option value="">Выберите руководителя отдела</option>
            <option value="Сергей Васильев">Сергей Васильев</option>
            <option value="Елена Кузнецова">Елена Кузнецова</option>
            <option value="Иван Петров">Иван Петров</option>
          </select>
        </div>

        <button
          className={styles.submitButton}
          onClick={handleSubmitPlan}
          disabled={isCreatingPlan}
        >
          {isCreatingPlan ? "Сохранение..." : "Создать план обучения"}
        </button>
      </div>
    </OverflowScrollBlock>
  );
}

export default Form;
