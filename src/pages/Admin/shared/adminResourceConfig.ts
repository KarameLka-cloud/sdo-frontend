import { ROUTES } from "@/constants/routes.ts";

export const TEMPLATE_ROUTES = {
  list: ROUTES.ADMIN_ADAPTATION_TEMPLATES,
  edit: ROUTES.ADMIN_ADAPTATION_TEMPLATE_TASKS,
} as const;

export const INTERNSHIP_ROUTES = {
  list: ROUTES.MENTORSHIP_INTERNS,
  edit: ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT,
} as const;

export const WORK_SCHEDULE_OPTIONS = ["5/2", "2/2"] as const;

export const buildEditPath = (template: string, id: number) =>
  template.replace(/:\w+/, String(id));

export { parseEntityId } from "@/utils/formValues.ts";
