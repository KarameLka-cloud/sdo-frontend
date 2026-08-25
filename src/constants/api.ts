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
  LEARNING_ITEMS: "api/learning-items/",
  ADAPTATION_PLANS: "api/mentorship/adaptation-plans/",
  ADAPTATION_MY_PLAN: "api/mentorship/adaptation-plans/my",
  ADAPTATION_MY_PLAN_DAYS: "api/mentorship/adaptation-plans/my/days/",
  ADAPTATION_PLAN_TEMPLATES: "api/mentorship/adaptation-plan-templates/",
  EMPLOYEES_SEARCH: "api/employees/search",
} as const;

export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
} as const;
