import { LearningType } from "@/interfaces/api/LearningItemType.ts";
import {
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
