import { JSX, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dateNow from "@/utils/dateNow.ts";
import { useUser } from "@/hooks/useUser.ts";
import Loader from "@/components/ui/custom/Loader";
import { useGetMyAdaptationPlanQuery } from "@/services/store/features/user.ts";
import { Skeleton } from "@/components/ui/skeleton";

// Типы вынесены в отдельную область
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

const SVG_CONFIG = {
  VIEW_BOX_SIZE: 100,
  RADIUS: 45,
  STROKE_WIDTH: 10,
  COLOR_BG: "#e2e8f0",
  COLOR_PRIMARY: "#000000",
} as const;

const CircularProgress = ({ percent }: { percent: number }): JSX.Element => {
  const { RADIUS, VIEW_BOX_SIZE, STROKE_WIDTH, COLOR_BG, COLOR_PRIMARY } =
    SVG_CONFIG;
  const circumference = 2 * Math.PI * RADIUS;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  if (percent === 100) {
    return (
      <div className="flex aspect-square h-full w-full flex-col items-center justify-center rounded-full bg-emerald-50">
        <span className="text-5xl" aria-label="Завершено">
          🏅
        </span>
        <span className="mt-2 text-base font-medium text-emerald-600">
          100%
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square h-full w-full max-w-30">
      <svg
        className="h-full w-full -rotate-90 transform"
        viewBox={`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
        aria-label={`Прогресс: ${percent}%`}
      >
        <circle
          cx={VIEW_BOX_SIZE / 2}
          cy={VIEW_BOX_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={COLOR_BG}
          strokeWidth={STROKE_WIDTH}
        />
        <circle
          cx={VIEW_BOX_SIZE / 2}
          cy={VIEW_BOX_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={COLOR_PRIMARY}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-foreground">
          {percent}%
        </span>
      </div>
    </div>
  );
};

const EmptyAdaptationPlan = (): JSX.Element => (
  <div
    className="flex h-full items-center justify-center rounded-3xl border border-border bg-muted/60 px-4 py-6 text-sm text-muted-foreground"
    role="status"
    aria-label="План адаптации не назначен"
  >
    План адаптации не назначен
  </div>
);

const useAdaptationProgress = (
  plan: AdaptationPlanResponse | null | undefined,
) => {
  return useMemo(() => {
    const days = Array.isArray(plan?.days) ? plan.days : [];

    const totalTasks = days.reduce((sum, day) => {
      return sum + (Array.isArray(day.tasks) ? day.tasks.length : 0);
    }, 0);

    if (totalTasks === 0) {
      return null;
    }

    const completedTasks = days.reduce((sum, day) => {
      if (!Array.isArray(day.tasks)) return sum;
      return (
        sum + day.tasks.filter((task) => task.status === "выполнено").length
      );
    }, 0);

    return {
      percent: Math.round((completedTasks / totalTasks) * 100),
      completedTasks,
      totalTasks,
    };
  }, [plan]);
};

const useHasAdaptationPlan = (
  plan: AdaptationPlanResponse | null | undefined,
) => {
  return useMemo(() => {
    return Boolean(plan && typeof plan.id === "number" && plan.id > 0);
  }, [plan]);
};

function Home(): JSX.Element {
  const { name, department, description } = useUser();
  const { data: myAdaptationPlan, isLoading: isAdaptationLoading } =
    useGetMyAdaptationPlanQuery(undefined);

  const plan = myAdaptationPlan as AdaptationPlanResponse | null | undefined;
  const adaptationProgress = useAdaptationProgress(plan);
  const hasAdaptationPlan = useHasAdaptationPlan(plan);

  const shortName = useMemo(() => {
    const nameParts = name.trim().split(/\s+/);
    return nameParts[1] || nameParts[0] || "Пользователь";
  }, [name]);

  return (
    <div className="h-full px-6 py-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden px-4 py-6">
          <CardHeader>
            <CardTitle>{dateNow}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-semibold text-foreground">
                Привет, {shortName} 👋
              </div>
              {description && (
                <div className="text-base font-medium text-primary">
                  {description}
                </div>
              )}
              {department && (
                <div className="text-sm text-muted-foreground">
                  {department}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden px-4 py-6">
          <CardContent className="h-full">
            {isAdaptationLoading ? (
              <div className="flex w-full max-w-xs flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : hasAdaptationPlan && adaptationProgress ? (
              <div className="flex h-full items-center justify-between gap-6">
                <div className="flex h-full flex-col justify-between">
                  <CardTitle>Прогресс адаптации</CardTitle>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Выполнено задач
                    </p>
                    <p className="text-3xl font-semibold text-foreground">
                      {adaptationProgress.completedTasks} /{" "}
                      {adaptationProgress.totalTasks}
                    </p>
                  </div>
                </div>

                <div className="flex h-full items-center justify-center">
                  <CircularProgress percent={adaptationProgress.percent} />
                </div>
              </div>
            ) : (
              <EmptyAdaptationPlan />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
