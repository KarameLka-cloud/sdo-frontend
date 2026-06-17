export interface CourseType {
  id: number;
  title: string;
  url: string;
  department_id?: number;
  department: string;
  note_department?: string;
  date_end: string;
}
