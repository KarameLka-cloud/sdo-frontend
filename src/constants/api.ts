export const API_ENDPOINTS = {
  AUTH_LOGIN: "api/auth/login",
  AUTH_LOGOUT: "api/auth/logout",
  ME: "api/users/me",
  USERS: "api/users",
  MENTORS: "api/users/mentors",
  DEPARTMENT_HEADS: "api/users/department-heads",
  ROLES: "api/users/roles",
  ASSIGN_ROLE: "api/users/assign-role",
  REVOKE_ROLE: "api/users/revoke-role",
  POSITIONS: "api/users/positions",
  DEPARTMENTS: "api/users/departments",
  EDUCATION_COURSES: "api/education/courses",
  EDUCATION_EVENTS: "api/education/events",
  EDUCATION_WEBINARS: "api/education/webinars",
  EDUCATION_TESTS: "api/education/tests",
  EDO_COURSES: "api/edo/courses",
  EDO_EVENTS: "api/edo/events",
  EDO_TESTS: "api/edo/tests",
  ADAPTATION_PLANS: "api/mentorship/adaptation-plans",
  ADAPTATION_MY_PLAN: "api/mentorship/adaptation-plans/my",
  ADAPTATION_MY_PLAN_DAYS: "api/mentorship/adaptation-plans/my/days",
  ADAPTATION_ALL_PLANS: "api/mentorship/adaptation-plans/all",
  ADAPTATION_PLAN_TEMPLATES: "api/mentorship/adaptation-plan-templates",
} as const;

export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
} as const;
