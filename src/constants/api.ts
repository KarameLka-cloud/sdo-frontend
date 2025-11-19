export const API_ENDPOINTS = {
    AUTH_LOGIN: 'api/auth/login/',
    AUTH_LOGOUT: 'api/auth/logout/',
    ME: 'api/users/me/',
    USERS: 'api/users/',
    ASSIGN_ADMIN_ROLE: 'api/users/assign-role',
    REVOKE_ADMIN_ROLE: 'api/users/revoke-role',
    POSITIONS: 'api/users/positions',
    DEPARTMENTS: 'api/users/departments',
    EDUCATION_COURSES: 'api/education/courses/',
    EDUCATION_EVENTS: 'api/education/events/',
    EDUCATION_WEBINARS: 'api/education/webinars/',
    EDUCATION_TESTS: 'api/education/tests/',
    EDO_COURSES: 'api/edo/courses/',
    EDO_EVENTS: 'api/edo/events/',
    EDO_TESTS: 'api/edo/tests/',
} as const;

export const COOKIE_NAMES = {
    AUTH_TOKEN: 'auth_token',
} as const;

export const LOCAL_STORAGE_NAMES = {
    USER: 'user',
} as const;
