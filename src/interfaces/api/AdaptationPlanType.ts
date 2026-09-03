/** Mirrors App\Enums\CompletionStatus on the backend. */
export type CompletionStatus = "в процессе" | "выполнен" | "есть замечания";

/** Mirrors App\Enums\TaskStatus on the backend. */
export type TaskStatus = "выполнено" | "не выполнено";

/** Mirrors App\Enums\ResponsibleRole on the backend. */
export type ResponsibleRole =
  | "Руководитель отдела"
  | "Наставник"
  | "Сотрудник УПиПК"
  | "Стажер";

export interface AdaptationPlanUserRef {
  id?: number;
  name?: string;
  department?: string;
}

export interface AdaptationPlanTaskType {
  id: number;
  description: string;
  status: TaskStatus;
  responsible_role?: ResponsibleRole;
  links?: string[] | null;
}

export interface AdaptationPlanDayType {
  id: number;
  work_day: number;
  day_from?: number | null;
  day_to?: number | null;
  date_from: string;
  date_to?: string | null;
  completion: CompletionStatus;
  employee_comment?: string | null;
  intern_comment?: string | null;
  mentor_comment?: string | null;
  department_head_comment?: string | null;
  tasks?: AdaptationPlanTaskType[];
}

export interface AdaptationPlanTemplateRef {
  id?: number;
  name?: string;
  work_schedule?: string;
  shifts?: number[];
}

export interface AdaptationPlanType {
  id: number;
  user_id: number;
  mentor: number;
  department_head: number;
  start_date?: string;
  work_schedule?: string;
  shift?: number;
  adaptation_plan_template_id?: number | null;
  user?: AdaptationPlanUserRef;
  template?: AdaptationPlanTemplateRef;
  mentor_user?: AdaptationPlanUserRef;
  department_head_user?: AdaptationPlanUserRef;
  days?: AdaptationPlanDayType[];
}
