import { JSX, useState } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import CareerDay from "@components/ui/CareerDay/CareerDay.tsx";
import { AdaptationDayType, TaskStatus } from "@interfaces/api/AdaptationDayType.ts";
import { useGetAdaptationPlansQuery } from "@services/store/features/user.ts";
import styles from "./Adaptation.module.css";

interface AdaptationPlanResponse {
  id: number;
  user_id: number;
  start_date: string;
  work_schedule: string;
  shift: number;
  mentor: string;
  department_head: string;
  user?: {
    id?: number;
    name?: string;
  };
}

function Adaptation(): JSX.Element {
  const { data: adaptationPlansData = [] } = useGetAdaptationPlansQuery(undefined);
  const adaptationPlans = adaptationPlansData as AdaptationPlanResponse[];
  const adaptationPlan = adaptationPlans[0];

  // Mock данные - в реальном приложении это будет от API
  const [adaptationDays, setAdaptationDays] = useState<AdaptationDayType[]>([
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
          links: ["https://portal.company.com/tools", "https://docs.company.com/access"],
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
          links: ["https://docs.company.com/department-guide", "https://wiki.company.com/procedures"],
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

  const handleUpdateInternComment = (
    dayId: number | undefined,
    comment: string,
  ) => {
    if (dayId !== undefined) {
      setAdaptationDays((prevDays) =>
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
      setAdaptationDays((prevDays) =>
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

  if (!adaptationPlan) {
    return <OverflowScrollBlock header_name={"Карьера"} />;
  }

  // Отображение плана обучения и задач для сотрудника
  return (
    <OverflowScrollBlock header_name={"Карьера"}>
      <div className={styles.trainingPlanInfo}>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Пользователь:</span>
          <span className={styles.planValue}>
            {adaptationPlan.user?.name || "—"} (ID: {adaptationPlan.user_id})
          </span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Начало стажировки:</span>
          <span className={styles.planValue}>{adaptationPlan.start_date}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>График:</span>
          <span className={styles.planValue}>{adaptationPlan.work_schedule}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Смена:</span>
          <span className={styles.planValue}>{adaptationPlan.shift}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Наставник:</span>
          <span className={styles.planValue}>{adaptationPlan.mentor}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Руководитель отдела:</span>
          <span className={styles.planValue}>{adaptationPlan.department_head}</span>
        </div>
      </div>

      <div className={styles.careerContainer}>
        {adaptationDays.map((day) => (
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

export default Adaptation;
