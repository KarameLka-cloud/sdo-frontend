import { ROUTES } from "@constants/routes";
import { Home, User, Notebook, Album, Users, Brain } from "lucide-react";
import firstWednesdayData from "@/utils/firstWednesday";

export const HOME_NAV_LINKS = [
  {
    id: 1,
    name: "Главная",
    path: ROUTES.HOME,
    icon: Home,
  },
  {
    id: 2,
    name: "Адаптация",
    path: ROUTES.ADAPTATION,
    icon: Brain,
  },
  {
    id: 3,
    name: "Обучение",
    path: "",
    icon: Notebook,
    children: [
      { id: 1, name: "Мероприятия", path: ROUTES.EDUCATION_EVENTS },
      { id: 2, name: "Эл. курсы", path: ROUTES.EDUCATION_COURSES },
      { id: 3, name: "Вебинары", path: ROUTES.EDUCATION_WEBINARS },
      { id: 4, name: "Тесты", path: ROUTES.EDUCATION_TESTS },
    ],
  },
  {
    id: 4,
    name: `ЕДО | ${firstWednesdayData}`,
    path: "",
    icon: Album,
    children: [
      { id: 1, name: "Мероприятия", path: ROUTES.EDO_EVENTS },
      { id: 2, name: "Эл. курсы", path: ROUTES.EDO_COURSES },
      { id: 3, name: "Тесты", path: ROUTES.EDO_TESTS },
    ],
  },
] as const;

export const MENTOR_NAV_LINKS = [
  {
    id: 1,
    name: "Стажеры",
    path: ROUTES.MENTORSHIP_INTERNS,
    icon: Users,
  },
  {
    id: 2,
    name: "Мои стажеры",
    path: ROUTES.MENTORSHIP_MY_INTERNS,
    icon: Users,
  },
] as const;

export const ADMIN_NAV_LINKS = [
  {
    id: 1,
    name: "Пользователи",
    path: ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    id: 2,
    name: "Обучение",
    path: "",
    icon: Notebook,
    children: [
      {
        id: 1,
        name: "Мероприятия",
        path: ROUTES.ADMIN_EDUCATION_EVENTS,
      },
      {
        id: 2,
        name: "Электронные курсы",
        path: ROUTES.ADMIN_EDUCATION_COURSE,
      },
      {
        id: 3,
        name: "Вебинары",
        path: ROUTES.ADMIN_EDUCATION_WEBINARS,
      },
      {
        id: 4,
        name: "Тесты",
        path: ROUTES.ADMIN_EDUCATION_TESTS,
      },
    ],
  },
  {
    id: 3,
    name: "ЕДО",
    path: "",
    icon: Album,
    children: [
      {
        id: 1,
        name: "Мероприятия",
        path: ROUTES.ADMIN_EDO_EVENTS,
      },
      {
        id: 2,
        name: "Электронные курсы",
        path: ROUTES.ADMIN_EDO_COURSES,
      },
      {
        id: 3,
        name: "Тесты",
        path: ROUTES.ADMIN_EDO_TESTS,
      },
    ],
  },
  {
    id: 4,
    name: "Адаптация",
    path: ROUTES.ADMIN_ADAPTATION_TEMPLATES,
    icon: Brain,
  },
] as const;
