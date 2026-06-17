export interface CourseType {
  id: number;
  title: string;
  description?: string;
  link: string;
  department_id?: number;
  department: string;
  note_department?: string;
  date: string;
  duration: number;
}
