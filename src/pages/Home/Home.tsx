import { JSX, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dateNow from "@/utils/dateNow.ts";
import { useUser } from "@/hooks/useUser.ts";
import { useGetMyAdaptationPlanQuery } from "@/services/store/features/user.ts";

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

  const shortName = name.split(" ")[1] ?? name;

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
              <div className="text-base font-medium text-primary">
                {description}
              </div>
              <div className="text-sm text-muted-foreground">{department}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden px-4 py-6">
          <CardHeader>
            <CardTitle>Прогресс адаптации</CardTitle>
          </CardHeader>
          <CardContent>
            {hasAdaptationPlan ? (
              <div className="space-y-3">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-4xl font-semibold text-foreground">
                      {adaptationProgress?.percent ?? 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Выполнено задач: {adaptationProgress?.completedTasks ?? 0}{" "}
                      из {adaptationProgress?.totalTasks ?? 0}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${adaptationProgress?.percent ?? 0}%` }}
                    />
                  </div>
                  {adaptationProgress?.percent === 100 && (
                    <p className="text-sm font-medium text-emerald-600">
                      🏅 Адаптация завершена
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-muted/60 px-4 py-6 text-sm text-muted-foreground">
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
