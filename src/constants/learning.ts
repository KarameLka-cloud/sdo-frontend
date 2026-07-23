import { ROUTES } from "@/constants/routes.ts";
import {
  LearningCategory,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";

export const LEARNING_CATEGORY_LABELS: Record<LearningCategory, string> = {
  education: "Обучение",
  edo: "ЕДО",
};

export const LEARNING_TYPE_LABELS: Record<LearningType, string> = {
  event: "Мероприятия",
  course: "Эл. курсы",
  webinar: "Вебинары",
  test: "Тесты",
};

export const LEARNING_TYPE_SINGULAR: Record<LearningType, string> = {
  event: "мероприятие",
  course: "курс",
  webinar: "вебинар",
  test: "тест",
};

export const LEARNING_TYPES_BY_CATEGORY: Record<
  LearningCategory,
  LearningType[]
> = {
  education: ["event", "course", "webinar", "test"],
  edo: ["event", "course", "test"],
};

export const isLearningCategory = (
  value: string | null | undefined,
): value is LearningCategory => value === "education" || value === "edo";

export const isLearningType = (
  value: string | null | undefined,
): value is LearningType =>
  value === "event" ||
  value === "course" ||
  value === "webinar" ||
  value === "test";

export const isValidLearningPair = (
  category: LearningCategory,
  type: LearningType,
): boolean => LEARNING_TYPES_BY_CATEGORY[category].includes(type);

export const buildLearningPath = (
  category: LearningCategory,
  type: LearningType,
): string => `${ROUTES.LEARNING}?category=${category}&type=${type}`;

export const buildAdminLearningPath = (
  category: LearningCategory,
  type: LearningType,
): string => `${ROUTES.ADMIN_LEARNING}?category=${category}&type=${type}`;

export const buildAdminLearningCreatePath = (
  category: LearningCategory,
  type: LearningType,
): string =>
  `${ROUTES.ADMIN_LEARNING_CREATE}?category=${category}&type=${type}`;

export const buildAdminLearningEditPath = (
  id: number,
  category: LearningCategory,
  type: LearningType,
): string =>
  `${ROUTES.ADMIN_LEARNING_EDIT.replace(":id", String(id))}?category=${category}&type=${type}`;

export const parseEntityId = (value: string | undefined): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const toDateInputValue = (value?: string | null) =>
  value ? value.split("T")[0] : "";

export const toTimeInputValue = (value?: string | null) => {
  if (!value) return "";
  const [hours, minutes] = value.split(":");
  return hours && minutes ? `${hours}:${minutes}` : "";
};
