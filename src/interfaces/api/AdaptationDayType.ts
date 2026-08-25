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

export interface TaskType {
  id?: number;
  description: string;
  status: TaskStatus;
  responsibleRole?: ResponsibleRole;
  links?: string[];
}

export interface AdaptationDayType {
  id?: number;
  workDay: number;
  dayFrom?: number;
  dayTo?: number;
  date: string;
  tasks: TaskType[];
  completion: CompletionStatus;
  employeeComment?: string;
  internComment?: string;
  mentorComment?: string;
  departmentHeadComment?: string;
}
