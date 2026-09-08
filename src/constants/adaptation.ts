import type {
  CompletionStatus,
  ResponsibleRole,
  TaskStatus,
} from "@/interfaces/api/AdaptationPlanType.ts";

export const WORK_SCHEDULE_OPTIONS = ["5/2", "2/2"] as const;

/** Matches App\Enums\ResponsibleRole. Intern is a plan-task role, not a template option. */
export const TEMPLATE_RESPONSIBLE_ROLES = [
  "Наставник",
  "Сотрудник УПиПК",
  "Начальник отдела",
] as const satisfies readonly ResponsibleRole[];

export const COMPLETION_STATUS_OPTIONS = [
  { value: "в процессе", label: "В процессе" },
  { value: "выполнен", label: "Выполнен" },
  { value: "есть замечания", label: "Есть замечания" },
] as const satisfies ReadonlyArray<{ value: CompletionStatus; label: string }>;

export const TASK_STATUS_OPTIONS = [
  { value: "не выполнено", label: "Не выполнено" },
  { value: "выполнено", label: "Выполнено" },
] as const satisfies ReadonlyArray<{ value: TaskStatus; label: string }>;

export const EMPTY_DAY_TASKS_MESSAGE = "На этот день задачи не назначены";

export const ROLE_USER_FIELDS = {
  mentor: {
    id: "plan-mentor",
    label: "Наставник",
    placeholder: "Выберите наставника",
    searchPlaceholder: "Поиск наставника...",
    emptyMessage: "Наставник не найден",
  },
  supervisor: {
    id: "plan-supervisor",
    label: "Руководитель отделения",
    placeholder: "Выберите руководителя отделения",
    searchPlaceholder: "Поиск руководителя отделения...",
    emptyMessage: "Руководитель отделения не найден",
  },
  departmentHead: {
    id: "plan-head",
    label: "Начальник отдела",
    placeholder: "Выберите начальника отдела",
    searchPlaceholder: "Поиск начальника отдела...",
    emptyMessage: "Начальник отдела не найден",
  },
} as const;
