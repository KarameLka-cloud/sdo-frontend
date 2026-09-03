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

export const LEARNING_DELETE_MESSAGES: Record<
  LearningType,
  { confirm: string; success: string; error: string }
> = {
  event: {
    confirm: "Удалить мероприятие?",
    success: "Мероприятие удалено",
    error: "Не удалось удалить мероприятие",
  },
  course: {
    confirm: "Удалить курс?",
    success: "Курс удалён",
    error: "Не удалось удалить курс",
  },
  webinar: {
    confirm: "Удалить вебинар?",
    success: "Вебинар удалён",
    error: "Не удалось удалить вебинар",
  },
  test: {
    confirm: "Удалить тест?",
    success: "Тест удалён",
    error: "Не удалось удалить тест",
  },
};

const LEARNING_TYPES_BY_CATEGORY: Record<LearningCategory, LearningType[]> = {
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

export const learningNeedsDepartments = (type: LearningType) =>
  type === "event" || type === "course";

export const learningNeedsPositions = (type: LearningType) => type === "test";

export const learningHasTime = (type: LearningType) =>
  type === "event" || type === "webinar";

export const resolveLearningRoute = (
  categoryParam: string | null,
  typeParam: string | null,
  buildPath: (category: LearningCategory, type: LearningType) => string,
):
  | { category: LearningCategory; type: LearningType }
  | { redirect: string } => {
  if (!isLearningCategory(categoryParam) || !isLearningType(typeParam)) {
    return { redirect: buildPath("education", "event") };
  }
  if (!isValidLearningPair(categoryParam, typeParam)) {
    return { redirect: buildPath(categoryParam, "event") };
  }
  return { category: categoryParam, type: typeParam };
};

export const buildLearningPath = (
  category: LearningCategory,
  type: LearningType,
): string => `${ROUTES.LEARNING}?category=${category}&type=${type}`;

export const buildAdminLearningPath = (
  category: LearningCategory,
  type: LearningType,
): string => `${ROUTES.ADMIN_LEARNING}?category=${category}&type=${type}`;
