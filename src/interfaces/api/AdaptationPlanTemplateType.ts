export interface AdaptationPlanTemplateTask {
  description: string;
  responsible_role: string;
  day_from?: number | null;
  day_to?: number | null;
  links?: string[];
}

export interface AdaptationPlanTemplateType {
  id: number;
  name: string;
  work_schedule: string;
  shifts: number[];
  task_blueprint?: AdaptationPlanTemplateTask[];
}
