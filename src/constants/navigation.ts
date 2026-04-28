import { ROUTES } from "@constants/routes";
import homeIcon from "@assets/images/icons/home.svg";
import personIcon from "@assets/images/icons/person.svg";
import bookIcon from "@assets/images/icons/book.svg";
import calendarIcon from "@assets/images/icons/calendar.svg";
import peopleIcon from "@assets/images/icons/people.svg";

export const HOME_NAV_LINKS = [
  {
    id: 1,
    name: "Главная",
    path: ROUTES.HOME,
    icon: homeIcon,
  },
  {
    id: 2,
    name: "Адаптация",
    path: ROUTES.ADAPTATION,
    icon: personIcon,
  },
  {
    id: 3,
    name: "Обучение",
    path: ROUTES.EDUCATION,
    icon: bookIcon,
  },
  {
    id: 4,
    name: "ЕДО",
    path: ROUTES.EDO,
    icon: calendarIcon,
  },
] as const;

export const MENTOR_NAV_LINKS = [
  {
    id: 1,
    name: "Стажеры",
    path: ROUTES.MENTORSHIP_INTERNS,
    icon: peopleIcon,
  },
  {
    id: 2,
    name: "Мои стажеры",
    path: ROUTES.MENTORSHIP_MY_INTERNS,
    icon: peopleIcon,
  },
] as const;

export const ADMIN_NAV_LINKS = [
  {
    id: 1,
    name: "Пользователи",
    path: ROUTES.ADMIN_USERS,
    icon: peopleIcon,
  },
  {
    id: 2,
    name: "Обучение",
    path: ROUTES.ADMIN_EDUCATION,
    icon: bookIcon,
  },
  {
    id: 3,
    name: "ЕДО",
    path: ROUTES.ADMIN_EDO,
    icon: calendarIcon,
  },
  {
    id: 4,
    name: "Адаптация",
    path: ROUTES.ADMIN_ADAPTATION_TEMPLATES,
    icon: personIcon,
  },
] as const;

export const ADMIN_NAV_EDUCATION_LINKS = [
  {
    id: 1,
    title: "Мероприятия",
    path: ROUTES.ADMIN_EDUCATION_EVENTS,
  },
  {
    id: 2,
    title: "Электронные курсы",
    path: ROUTES.ADMIN_EDUCATION_COURSE,
  },
  {
    id: 3,
    title: "Вебинары",
    path: ROUTES.ADMIN_EDUCATION_WEBINARS,
  },
  {
    id: 4,
    title: "Тесты",
    path: ROUTES.ADMIN_EDUCATION_TESTS,
  },
] as const;

export const ADMIN_NAV_EDO_LINKS = [
  {
    id: 1,
    title: "Мероприятия",
    path: ROUTES.ADMIN_EDO_EVENTS,
  },
  {
    id: 2,
    title: "Электронные курсы",
    path: ROUTES.ADMIN_EDO_COURSES,
  },
  {
    id: 3,
    title: "Тесты",
    path: ROUTES.ADMIN_EDO_TESTS,
  },
] as const;
