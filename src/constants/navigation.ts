import { ROUTES } from "@constants/routes";
import type { LucideIcon } from "lucide-react";
import { Home, Notebook, Album, Users, Brain, BookUser } from "lucide-react";
import firstWednesdayData from "@/utils/firstWednesday";
import {
  buildAdminLearningPath,
  buildLearningPath,
} from "@/constants/learning.ts";

interface NavigationItemChild {
  id: number;
  name: string;
  path: string;
}

export interface NavigationItem {
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
      {
        id: 1,
        name: "Мероприятия",
        path: buildLearningPath("education", "event"),
      },
      {
        id: 2,
        name: "Эл. курсы",
        path: buildLearningPath("education", "course"),
      },
      {
        id: 3,
        name: "Вебинары",
        path: buildLearningPath("education", "webinar"),
      },
      { id: 4, name: "Тесты", path: buildLearningPath("education", "test") },
    ],
  },
  {
    id: 4,
    name: `ЕДО | ${firstWednesdayData}`,
    path: "",
    icon: Album,
    children: [
      { id: 1, name: "Мероприятия", path: buildLearningPath("edo", "event") },
      { id: 2, name: "Эл. курсы", path: buildLearningPath("edo", "course") },
      { id: 3, name: "Тесты", path: buildLearningPath("edo", "test") },
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

export const SERVICES_NAV_LINKS: ReadonlyArray<NavigationItem> = [
  {
    id: 1,
    name: "Справочник сотрудника",
    path: ROUTES.EMPLOYEES,
    icon: BookUser,
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
        path: buildAdminLearningPath("education", "event"),
      },
      {
        id: 2,
        name: "Электронные курсы",
        path: buildAdminLearningPath("education", "course"),
      },
      {
        id: 3,
        name: "Вебинары",
        path: buildAdminLearningPath("education", "webinar"),
      },
      {
        id: 4,
        name: "Тесты",
        path: buildAdminLearningPath("education", "test"),
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
        path: buildAdminLearningPath("edo", "event"),
      },
      {
        id: 2,
        name: "Электронные курсы",
        path: buildAdminLearningPath("edo", "course"),
      },
      {
        id: 3,
        name: "Тесты",
        path: buildAdminLearningPath("edo", "test"),
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
