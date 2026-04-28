import { JSX } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import Development from "@components/ui/Development/Development.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import { useGetMyAdaptationPlanQuery } from "@services/store/features/user.ts";
import styles from "./Adaptation.module.css";
import convertDate from "@utils/convertDate.ts";

interface AdaptationPlanResponse {
  id: number;
  user_id: number;
  start_date: string;
  work_schedule: string;
  shift: number;
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
  };
}

function Adaptation(): JSX.Element {
  const {
    data: adaptationPlan,
    isLoading,
    isFetching,
    isError,
  } = useGetMyAdaptationPlanQuery(undefined);

  const myAdaptationPlan = adaptationPlan as AdaptationPlanResponse | null | undefined;

  if (isLoading || isFetching) {
    return <></>;
  }

  if (isError) {
    return (
      <OverflowScrollBlock header_name={"Адаптация"}>
        <DataMessage type={"error"} />
      </OverflowScrollBlock>
    );
  }

  if (!myAdaptationPlan) {
    return <Development />;
  }

  // Отображение плана обучения и задач для сотрудника
  return (
    <OverflowScrollBlock header_name={"Адаптация"}>
      <div className={styles.trainingPlanInfo}>
        {/* <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Пользователь:</span>
          <span className={styles.planValue}>
            {adaptationPlan.user?.name || "—"} (ID: {adaptationPlan.user_id})
          </span>
        </div> */}
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Начало стажировки:</span>
          <span className={styles.planValue}>{convertDate(myAdaptationPlan.start_date)}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>График:</span>
          <span className={styles.planValue}>{myAdaptationPlan.work_schedule}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Смена:</span>
          <span className={styles.planValue}>{myAdaptationPlan.shift}</span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Наставник:</span>
          <span className={styles.planValue}>
            {myAdaptationPlan.mentor_user?.name ?? `ID: ${myAdaptationPlan.mentor}`}
          </span>
        </div>
        <div className={styles.planInfoItem}>
          <span className={styles.planLabel}>Руководитель отдела:</span>
          <span className={styles.planValue}>{myAdaptationPlan.department_head_user?.name}</span>
            {/* {adaptationPlan.department_head_user?.name ??
              `ID: ${adaptationPlan.department_head}`}
          </span> */}
        </div>
      </div>

      {/* <div className={styles.careerContainer}>
        {adaptationDays.map((day) => (
          <CareerDay
            key={day.id}
            day={day}
            onUpdateInternComment={handleUpdateInternComment}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        ))}
      </div> */}
    </OverflowScrollBlock>
  );
}

export default Adaptation;
