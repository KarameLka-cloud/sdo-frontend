import {
  LearningCategory,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import {
  learningHasTime,
  learningNeedsDepartments,
  learningNeedsPositions,
} from "@/constants/learning.ts";

export type LearningItemFormValues = {
  title: string;
  description: string;
  link: string;
  departmentId: string;
  noteDepartment: string;
  positionId: string;
  notePosition: string;
  date: string;
  time: string;
  duration: string;
};

export const EMPTY_LEARNING_FORM: LearningItemFormValues = {
  title: "",
  description: "",
  link: "",
  departmentId: "",
  noteDepartment: "",
  positionId: "",
  notePosition: "",
  date: "",
  time: "",
  duration: "",
};

export const LEARNING_CREATE_TITLES: Record<LearningType, string> = {
  event: "Создание мероприятия",
  course: "Создание курса",
  webinar: "Создание вебинара",
  test: "Создание теста",
};

export const LEARNING_EDIT_TITLES: Record<LearningType, string> = {
  event: "Редактирование мероприятия",
  course: "Редактирование курса",
  webinar: "Редактирование вебинара",
  test: "Редактирование теста",
};

export const LEARNING_CREATE_SUBMIT_LABELS: Record<LearningType, string> = {
  event: "Создать мероприятие",
  course: "Создать курс",
  webinar: "Создать вебинар",
  test: "Создать тест",
};

export const LEARNING_MESSAGES = {
  create: {
    success: {
      event: "Мероприятие создано",
      course: "Курс создан",
      webinar: "Вебинар создан",
      test: "Тест создан",
    },
    error: {
      event: "Не удалось создать мероприятие",
      course: "Не удалось создать курс",
      webinar: "Не удалось создать вебинар",
      test: "Не удалось создать тест",
    },
  },
  update: {
    success: {
      event: "Мероприятие сохранено",
      course: "Курс сохранён",
      webinar: "Вебинар сохранён",
      test: "Тест сохранён",
    },
    error: {
      event: "Не удалось сохранить мероприятие",
      course: "Не удалось сохранить курс",
      webinar: "Не удалось сохранить вебинар",
      test: "Не удалось сохранить тест",
    },
  },
} as const satisfies Record<
  "create" | "update",
  Record<"success" | "error", Record<LearningType, string>>
>;

export function validateLearningItemForm(
  type: LearningType,
  values: LearningItemFormValues,
): string | null {
  if (!values.title.trim()) return "Укажите название";
  if ((type === "course" || type === "test") && !values.link.trim()) {
    return "Укажите ссылку";
  }
  if (learningNeedsDepartments(type) && !values.departmentId) {
    return "Выберите отдел";
  }
  if (learningNeedsPositions(type) && !values.positionId) {
    return "Выберите должность";
  }
  if (!values.date) return "Укажите дату";
  if (!values.duration.trim() || Number(values.duration) < 1) {
    return "Укажите длительность в минутах";
  }
  return null;
}

type ToPayloadOptions = {
  category: LearningCategory;
  type: LearningType;
  id?: number;
  /** For updates, unset org fields become null; for create they become undefined. */
  mode: "create" | "update";
};

export function toLearningItemPayload(
  values: LearningItemFormValues,
  { category, type, id, mode }: ToPayloadOptions,
) {
  const needsDepartments = learningNeedsDepartments(type);
  const needsPositions = learningNeedsPositions(type);
  const emptyOrg = mode === "update" ? null : undefined;

  return {
    ...(id != null ? { id } : {}),
    category,
    type,
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    link: values.link.trim() || undefined,
    department_id: needsDepartments ? Number(values.departmentId) : emptyOrg,
    note_department: needsDepartments
      ? values.noteDepartment.trim() || undefined
      : emptyOrg,
    position_id: needsPositions ? Number(values.positionId) : emptyOrg,
    note_position: needsPositions
      ? values.notePosition.trim() || undefined
      : emptyOrg,
    date: values.date,
    time: learningHasTime(type)
      ? values.time || undefined
      : mode === "update"
        ? null
        : undefined,
    duration: Number(values.duration),
  };
}
