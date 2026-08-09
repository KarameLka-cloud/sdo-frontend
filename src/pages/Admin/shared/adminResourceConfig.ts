import { ROUTES } from "@/constants/routes.ts";

export const TEMPLATE_ROUTES = {
  list: ROUTES.ADMIN_ADAPTATION_TEMPLATES,
  create: ROUTES.ADMIN_ADAPTATION_TEMPLATES_CREATE,
  edit: ROUTES.ADMIN_ADAPTATION_TEMPLATE_TASKS,
} as const;

export const INTERNSHIP_ROUTES = {
  list: ROUTES.MENTORSHIP_INTERNS,
  create: ROUTES.MENTORSHIP_INTERNS_PLAN_CREATE,
  edit: ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT,
} as const;

export const USER_ROUTES = {
  list: ROUTES.ADMIN_USERS,
  edit: ROUTES.ADMIN_USER_EDIT,
} as const;

export const WORK_SCHEDULE_OPTIONS = ["5/2", "2/2"] as const;

export const buildEditPath = (template: string, id: number) =>
  template.replace(/:\w+/, String(id));

export { parseEntityId } from "@/utils/formValues.ts";
