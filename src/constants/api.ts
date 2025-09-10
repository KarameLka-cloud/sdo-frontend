export const API_ENDPOINTS = {
    AUTH_LOGIN: 'api/auth/login',
    AUTH_LOGOUT: 'api/auth/logout',
    ME: 'api/users/me',
    USERS: 'api/users',
    COURSES: 'api/courses',
    EVENTS: 'api/events',
    WEBINARS: 'api/webinars',
    TESTS: 'api/tests',
} as const;

export const COOKIE_NAMES = {
    AUTH_TOKEN: 'auth_token',
} as const;

export const LOCAL_STORAGE_NAMES = {
    USER: 'user',
} as const;
