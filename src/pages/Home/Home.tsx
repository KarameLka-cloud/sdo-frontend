import { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import dateNow from "@/utils/dateNow.ts";
import { useUser } from "@/hooks/useUser.ts";
import { useGetMyAdaptationPlanQuery } from "@/services/store/features/user.ts";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import type { AdaptationPlanType } from "@/interfaces/api/AdaptationPlanType.ts";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getAdaptationProgress(plan?: AdaptationPlanType | null) {
  const tasks = (plan?.days ?? []).flatMap((day) => day.tasks ?? []);
  if (tasks.length === 0) return null;

  const completedTasks = tasks.filter((t) => t.status === "выполнено").length;
  return {
    percent: Math.round((completedTasks / tasks.length) * 100),
    completedTasks,
    totalTasks: tasks.length,
  };
}

const CircularProgress = ({ percent }: { percent: number }): JSX.Element => {
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
    <div className="relative aspect-square h-full w-full max-w-32">
      <svg
        className="h-full w-full -rotate-90 transform"
        viewBox="0 0 100 100"
        aria-label={`Прогресс: ${percent}%`}
      >
        <circle
          cx={50}
          cy={50}
          r={RADIUS}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={10}
        />
        <circle
          cx={50}
          cy={50}
          r={RADIUS}
          fill="none"
          stroke="#000000"
          strokeWidth={10}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
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

function Home(): JSX.Element {
  const { name, department, description } = useUser();
  const { data: plan, isLoading } = useGetMyAdaptationPlanQuery(undefined);

  const adaptationPlan = plan ?? undefined;
  const progress = getAdaptationProgress(adaptationPlan);
  const hasPlan = Boolean(adaptationPlan?.id && adaptationPlan.id > 0);

  const nameParts = name.trim().split(/\s+/);
  const shortName = nameParts[1] || nameParts[0] || "Пользователь";

  return (
    <div className="h-full px-6 py-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden px-4 py-6">
          <CardHeader>
            <CardTitle>{dateNow()}</CardTitle>
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
            {isLoading ? (
              <div className="flex h-full flex-col justify-between">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : hasPlan && progress ? (
              <div className="flex h-full items-center justify-between gap-6">
                <div className="flex h-full flex-col justify-between">
                  <CardTitle>Прогресс адаптации</CardTitle>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Выполнено задач
                    </p>
                    <p className="text-3xl font-semibold text-foreground">
                      {progress.completedTasks} / {progress.totalTasks}
                    </p>
                  </div>
                </div>
                <div className="flex h-full items-center justify-center">
                  <CircularProgress percent={progress.percent} />
                </div>
              </div>
            ) : (
              <div
                className="flex h-full items-center justify-center rounded-3xl border border-border bg-muted/60 px-4 py-6 text-sm text-muted-foreground"
                role="status"
                aria-label="План адаптации не назначен"
              >
                План адаптации не назначен
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
