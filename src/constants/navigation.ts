import { ROUTES } from "@/constants/routes";
import type { LucideIcon } from "lucide-react";
import { Home, Notebook, Album, Users, Brain, BookUser } from "lucide-react";
import firstWednesdayData from "@/utils/firstWednesday";
import {
  buildAdminLearningPath,
  buildLearningPath,
  learningNavChildren,
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
    children: learningNavChildren("education", buildLearningPath),
  },
  {
    id: 4,
    name: `ЕДО | ${firstWednesdayData}`,
    path: "",
    icon: Album,
    children: learningNavChildren("edo", buildLearningPath),
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
    children: learningNavChildren("education", buildAdminLearningPath),
  },
  {
    id: 3,
    name: "ЕДО",
    path: "",
    icon: Album,
    children: learningNavChildren("edo", buildAdminLearningPath),
  },
  {
    id: 4,
    name: "Шаблоны адаптации",
    path: ROUTES.ADMIN_ADAPTATION_TEMPLATES,
    icon: Brain,
  },
];
