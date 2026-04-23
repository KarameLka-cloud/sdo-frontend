export type CompletionStatus = "в процессе" | "выполнен" | "повторить" | "есть замечания";
export type TaskStatus = "выполнено" | "не выполнено";
export type ResponsibleRole = "Руководитель отдела" | "Наставник" | "Сотрудник УПиПК" | "Стажер";

export interface TaskType {
    id?: number;
    description: string;
    status: TaskStatus;
    responsibleRole?: ResponsibleRole;
}

export interface CareerDayType {
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
}
