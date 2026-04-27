export type CompletionStatus =
  | "в процессе"
  | "выполнен"
  | "повторить"
  | "есть замечания";

export type TaskStatus = "выполнено" | "не выполнено";

export type ResponsibleRole =
  | "Руководитель отдела"
  | "Наставник"
  | "Сотрудник УПиПК"
  | "Стажер";

export type WorkSchedule = "5/2" | "2/2";

export interface TaskType {
  id?: number;
  description: string;
  status: TaskStatus;
  responsibleRole?: ResponsibleRole;
  links?: string[];
}

export interface TrainingPlanType {
  userId: number | null;
  userName: string;
  startDate: string;
  workSchedule: WorkSchedule;
  shift: number;
  mentor: number | null;
  departmentHead: number | null;
}

export interface AdaptationDayType {
  id?: number;
  workDay: number;
  date: string;
  tasks: TaskType[];
  completion: CompletionStatus;
  responsible: string;
  employeeComment?: string;
  internComment?: string;
  mentorComment?: string;
  departmentHeadComment?: string;
  trainingPlan?: TrainingPlanType;
}
