import { ROUTES, RouteValue } from "@/constants/routes.ts";

export type AdminDomain = "education" | "edo";

export const ADMIN_DOMAIN_LABELS: Record<AdminDomain, string> = {
  education: "Обучение",
  edo: "ЕДО",
};

export const ADMIN_DOMAIN_LIST_ROUTES: Record<AdminDomain, RouteValue> = {
  education: ROUTES.ADMIN_EDUCATION_EVENTS,
  edo: ROUTES.ADMIN_EDO_EVENTS,
};

export const COURSE_ROUTES: Record<AdminDomain, { list: RouteValue; create: RouteValue; edit: RouteValue }> = {
  education: {
    list: ROUTES.ADMIN_EDUCATION_COURSE,
    create: ROUTES.ADMIN_EDUCATION_COURSE_CREATE,
    edit: ROUTES.ADMIN_EDUCATION_COURSE_EDIT,
  },
  edo: {
    list: ROUTES.ADMIN_EDO_COURSES,
    create: ROUTES.ADMIN_EDO_COURSES_CREATE,
    edit: ROUTES.ADMIN_EDO_COURSES_EDIT,
  },
};

export const EVENT_ROUTES: Record<AdminDomain, { list: RouteValue; create: RouteValue; edit: RouteValue }> = {
  education: {
    list: ROUTES.ADMIN_EDUCATION_EVENTS,
    create: ROUTES.ADMIN_EDUCATION_EVENTS_CREATE,
    edit: ROUTES.ADMIN_EDUCATION_EVENTS_EDIT,
  },
  edo: {
    list: ROUTES.ADMIN_EDO_EVENTS,
    create: ROUTES.ADMIN_EDO_EVENTS_CREATE,
    edit: ROUTES.ADMIN_EDO_EVENTS_EDIT,
  },
};

export const TEST_ROUTES: Record<AdminDomain, { list: RouteValue; create: RouteValue; edit: RouteValue }> = {
  education: {
    list: ROUTES.ADMIN_EDUCATION_TESTS,
    create: ROUTES.ADMIN_EDUCATION_TESTS_CREATE,
    edit: ROUTES.ADMIN_EDUCATION_TESTS_EDIT,
  },
  edo: {
    list: ROUTES.ADMIN_EDO_TESTS,
    create: ROUTES.ADMIN_EDO_TESTS_CREATE,
    edit: ROUTES.ADMIN_EDO_TESTS_EDIT,
  },
};

export const WEBINAR_ROUTES = {
  list: ROUTES.ADMIN_EDUCATION_WEBINARS,
  create: ROUTES.ADMIN_EDUCATION_WEBINARS_CREATE,
  edit: ROUTES.ADMIN_EDUCATION_WEBINARS_EDIT,
} as const;

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

export const toDateInputValue = (value?: string | null) =>
  value ? value.split("T")[0] : "";

export const toTimeInputValue = (value?: string | null) => {
  if (!value) return "";
  const [hours, minutes] = value.split(":");
  return hours && minutes ? `${hours}:${minutes}` : "";
};

export const parseEntityId = (value: string | undefined): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
