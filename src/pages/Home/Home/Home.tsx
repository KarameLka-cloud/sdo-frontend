import { JSX, useMemo } from "react";
import styles from "./Home.module.css";
import image_fox from "@assets/images/fox.png";
import dateNow from "@utils/dateNow.ts";
import { useUser } from "@hooks/useUser.ts";
import { useGetMyAdaptationPlanQuery } from "@services/store/features/user.ts";

interface AdaptationTask {
  id: number;
  status?: "выполнено" | "не выполнено";
}

interface AdaptationDay {
  completion: "в процессе" | "выполнен" | "повторить" | "есть замечания";
  tasks?: AdaptationTask[];
}

interface AdaptationPlanResponse {
  id?: number;
  days?: AdaptationDay[];
}

function Home(): JSX.Element {
  const { name, department, description } = useUser();
  const { data: myAdaptationPlan } = useGetMyAdaptationPlanQuery(undefined);

  const adaptationProgress = useMemo(() => {
    const plan = myAdaptationPlan as AdaptationPlanResponse | null | undefined;
    const days = Array.isArray(plan?.days) ? plan.days : [];

    const totalTasks = days.reduce((accumulator, day) => {
      return accumulator + (Array.isArray(day.tasks) ? day.tasks.length : 0);
    }, 0);

    if (totalTasks === 0) {
      return null;
    }

    const completedTasks = days.reduce((accumulator, day) => {
      if (!Array.isArray(day.tasks)) {
        return accumulator;
      }

      return (
        accumulator +
        day.tasks.filter((task) => task.status === "выполнено").length
      );
    }, 0);

    const percent = Math.round((completedTasks / totalTasks) * 100);

    return {
      percent,
      completedTasks,
      totalTasks,
    };
  }, [myAdaptationPlan]);

  const hasAdaptationPlan = useMemo(() => {
    const plan = myAdaptationPlan as AdaptationPlanResponse | null | undefined;
    return Boolean(plan && typeof plan.id === "number" && plan.id > 0);
  }, [myAdaptationPlan]);

  const progressBarColor = useMemo(() => {
    if (!adaptationProgress) {
      return "var(--mfc-dark-color)";
    }

    if (adaptationProgress.percent <= 30) {
      return "#e53935";
    }

    if (adaptationProgress.percent <= 60) {
      return "#fdd835";
    }

    if (adaptationProgress.percent < 100) {
      return "#fb8c00";
    }

    return "#43a047";
  }, [adaptationProgress]);

  return (
    <div className={styles.container}>
      <div className={styles.info_component}>
        <div className={styles.info_date}>{dateNow}</div>
        <div className={styles.info_name}>
          {`Привет, ${name.split(" ")[1]}`} 👋
        </div>
        <div className={styles.info_department}>{department}</div>
        <div className={styles.info_description}>{description}</div>
        <img className={styles.info_img} src={image_fox} alt="Девушка" />
      </div>
      {hasAdaptationPlan && (
        <div className={styles.adaptationStatusSection}>
          {adaptationProgress ? (
            <div className={styles.adaptationStatusBlocks}>
              <div
                className={`${styles.adaptationStatusBlock} ${styles.adaptationStatusBlockProgress}`}
              >
                <div
                  className={`${styles.adaptationStatusValue} ${
                    adaptationProgress.percent === 100
                      ? styles.adaptationStatusValueCompleted
                      : ""
                  }`}
                >
                  {adaptationProgress.percent}%
                </div>
                {adaptationProgress.percent === 100 ? (
                  <div className={styles.adaptationStatusAward}>
                    🏅 Адаптация завершена
                  </div>
                ) : (
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${adaptationProgress.percent}%`,
                        background: progressBarColor,
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                className={`${styles.adaptationStatusBlock} ${styles.adaptationStatusBlockDetails}`}
              >
                <div className={styles.adaptationStatusInfo}>
                  <div className={styles.adaptationStatusTitle}>
                    Статус прохождения адаптации
                  </div>
                </div>
                <div className={styles.adaptationStatusMeta}>
                  Выполнено задач: {adaptationProgress.completedTasks} из{" "}
                  {adaptationProgress.totalTasks}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.adaptationStatusMeta}>
              Нет задач для расчета прогресса.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
