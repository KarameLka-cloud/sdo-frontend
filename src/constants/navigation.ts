import { ROUTES } from "@constants/routes";
import type { LucideIcon } from "lucide-react";
import { Home, Notebook, Album, Users, Brain } from "lucide-react";
import firstWednesdayData from "@/utils/firstWednesday";

interface NavigationItemChild {
  id: number;
  name: string;
  path: string;
}

interface NavigationItem {
  id: number;
  name: string;
  path: string;
  icon: LucideIcon;
  children?: readonly NavigationItemChild[];
}

export const HOME_NAV_LINKS: ReadonlyArray<NavigationItem> = [
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
];

export const MENTOR_NAV_LINKS: ReadonlyArray<NavigationItem> = [
  {
    id: 1,
    name: "Стажеры",
    path: ROUTES.MENTORSHIP_INTERNS,
    icon: Users,
  },
];

export const ADMIN_NAV_LINKS: ReadonlyArray<NavigationItem> = [
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
];
