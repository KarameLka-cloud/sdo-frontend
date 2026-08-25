import type {
  CompletionStatus,
  TaskStatus,
} from "@/interfaces/api/AdaptationDayType.ts";

export type EditableCommentKey =
  | "employee_comment"
  | "mentor_comment"
  | "department_head_comment";

export interface CommentPermissions {
  canEditEmployee: boolean;
  canEditDepartmentHead: boolean;
  canEditMentor: boolean;
}

export interface EditablePlanTask {
  id: number;
  description: string;
  status: TaskStatus;
}

export interface EditablePlanDay {
  id: number;
  work_day: number;
  day_from?: number | null;
  day_to?: number | null;
  date_from: string;
  date_to?: string | null;
  completion: CompletionStatus;
  employee_comment: string;
  intern_comment: string;
  mentor_comment: string;
  department_head_comment: string;
  tasks: EditablePlanTask[];
}
