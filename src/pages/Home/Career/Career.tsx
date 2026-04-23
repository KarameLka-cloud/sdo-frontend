import { JSX, useState } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import CareerDay from "@components/ui/CareerDay/CareerDay.tsx";
import {
  CareerDayType,
  TaskStatus,
  TrainingPlanType,
  WorkSchedule,
} from "@interfaces/api/CareerDayType.ts";
import styles from "./Career.module.css";

function Career(): JSX.Element {
  // Mock данные - в реальном приложении это будет от API
  const [careerDays, setCareerDays] = useState<CareerDayType[]>([
    {
      id: 1,
      workDay: 1,
      date: "2026-04-20",
      tasks: [
        {
          id: 1,
          description: "Ознакомление с коллективом",
          status: "выполнено",
          responsibleRole: "Наставник",
        },
        {
          id: 2,
          description: "Изучение структуры отдела",
          status: "выполнено",
          responsibleRole: "Руководитель отдела",
        },
        {
          id: 3,
          description: "Получение инструментов и доступов",
          status: "выполнено",
          responsibleRole: "Сотрудник УПиПК",
        },
      ],
      completion: "выполнен",
      responsible: "Иван Петров",
      employeeComment: "Первый день прошел хорошо, коллектив дружелюбный",
      internComment: "Было интересно познакомиться с командой",
      mentorComment: "Стажер проявил инициативу и внимательность",
      departmentHeadComment: "Впечатление положительное",
    },
    {
      id: 2,
      workDay: 2,
      date: "2026-04-21",
      tasks: [
        {
          id: 4,
          description: "Обучение системам",
          status: "выполнено",
          responsibleRole: "Наставник",
        },
        {
          id: 5,
          description: "Изучение документации",
          status: "не выполнено",
          responsibleRole: "Руководитель отдела",
        },
        {
          id: 6,
          description: "Первые практические упражнения",
          status: "не выполнено",
          responsibleRole: "Наставник",
        },
      ],
      completion: "есть замечания",
      responsible: "Мария Сидорова",
      employeeComment: "Много информации, но интересно",
      internComment: "Начал изучать документацию",
      mentorComment: "Хорошо усваивает материал",
      departmentHeadComment: "Впечатление положительное",
    },
    {
      id: 3,
      workDay: 3,
      date: "2026-04-22",
      tasks: [
        {
          id: 7,
          description: "Участие в проектных встречах",
          status: "не выполнено",
          responsibleRole: "Руководитель отдела",
        },
        {
          id: 8,
          description: "Выполнение простых задач",
          status: "не выполнено",
          responsibleRole: "Наставник",
        },
        {
          id: 9,
          description: "Подготовка отчета",
          status: "не выполнено",
          responsibleRole: "Сотрудник УПиПК",
        },
      ],
      completion: "в процессе",
      responsible: "Алексей Кузнецов",
      employeeComment: "",
      internComment: "Выполнил все задачи",
      mentorComment: "Прогресс очевиден",
      departmentHeadComment: "Впечатление положительное",
    },
  ]);

  // Состояние для плана обучения - изначально не установлен
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlanType | null>(
    null,
  );
  const [formData, setFormData] = useState<TrainingPlanType>({
    startDate: "",
    workSchedule: "5/2",
    shift: 1,
    mentor: "",
    departmentHead: "",
  });
  const [error, setError] = useState<string>("");

  const handleSubmitPlan = () => {
    setError("");
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
    setTrainingPlan(formData);
  };

  const handleUpdateInternComment = (
    dayId: number | undefined,
    comment: string,
  ) => {
    if (dayId !== undefined) {
      setCareerDays((prevDays) =>
        prevDays.map((day) =>
          day.id === dayId ? { ...day, internComment: comment } : day,
        ),
      );
    }
  };

  const handleUpdateTaskStatus = (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ) => {
    if (dayId !== undefined && taskId !== undefined) {
      setCareerDays((prevDays) =>
        prevDays.map((day) =>
          day.id === dayId
            ? {
                ...day,
                tasks: Array.isArray(day.tasks)
                  ? day.tasks.map((task) =>
                      task.id === taskId ? { ...task, status } : task,
                    )
                  : day.tasks,
              }
            : day,
        ),
      );
    }
  };

  // Если плана обучения нет, показываем форму
  if (!trainingPlan) {
    return (
      <OverflowScrollBlock header_name={"Карьера"}>
        <div className={styles.trainingPlanForm}>
          <h2 className={styles.formTitle}>Создание плана обучения</h2>
          <p className={styles.formDescription}>
            Заполните информацию для начала создания плана обучения
          </p>

          {error && <div className={styles.errorMessage}>{error}</div>}

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

          <button className={styles.submitButton} onClick={handleSubmitPlan}>
            Создать план обучения
          </button>
        </div>
      </OverflowScrollBlock>
    );
  }

  // Если план обучения установлен, показываем задачи
  return (
    <OverflowScrollBlock header_name={"Карьера"}>
      <div className={styles.trainingPlanInfo}>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Начало стажировки:</span>
          <span className={styles.planValue}>{trainingPlan.startDate}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>График:</span>
          <span className={styles.planValue}>{trainingPlan.workSchedule}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Смена:</span>
          <span className={styles.planValue}>{trainingPlan.shift}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Наставник:</span>
          <span className={styles.planValue}>{trainingPlan.mentor}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Руководитель отдела:</span>
          <span className={styles.planValue}>{trainingPlan.departmentHead}</span>
        </div>
      </div>

      <div className={styles.careerContainer}>
        {careerDays.map((day) => (
          <CareerDay
            key={day.id}
            day={day}
            onUpdateInternComment={handleUpdateInternComment}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        ))}
      </div>
    </OverflowScrollBlock>
  );
}

export default Career;
