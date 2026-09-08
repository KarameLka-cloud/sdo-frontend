import type { ResponsibleRole } from "@/interfaces/api/AdaptationPlanType.ts";

export interface AdaptationPlanTemplateTask {
  description: string;
  responsible_role: ResponsibleRole;
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
