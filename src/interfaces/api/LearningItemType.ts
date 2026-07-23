export type LearningCategory = "education" | "edo";
export type LearningType = "event" | "course" | "webinar" | "test";

export interface LearningItemType {
  id: number;
  category: LearningCategory;
  type: LearningType;
  title: string;
  description?: string | null;
  link?: string | null;
  department_id?: number | null;
  department?: string | null;
  note_department?: string | null;
  position_id?: number | null;
  position?: string | null;
  note_position?: string | null;
  time?: string | null;
  date: string;
  duration: number;
}
