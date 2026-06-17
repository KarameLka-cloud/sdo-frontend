import { CourseType } from "@/interfaces/api/CourseType.ts";
import { EventType } from "@/interfaces/api/EventType.ts";
import { TestType } from "@/interfaces/api/TestType.ts";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import {
  toDateInputValue,
  toTimeInputValue,
} from "@/pages/Admin/shared/adminResourceConfig.ts";

export function mapCourseToFormValues(course: CourseType) {
  return {
    title: course.title ?? "",
    description: course.description ?? "",
    link: course.link ?? "",
    departmentId:
      course.department_id != null ? String(course.department_id) : "",
    noteDepartment: course.note_department ?? "",
    date: toDateInputValue(course.date),
    duration: course.duration != null ? String(course.duration) : "",
  };
}

export function mapEventToFormValues(event: EventType) {
  return {
    title: event.title ?? "",
    description: event.description ?? "",
    link: event.link ?? "",
    departmentId:
      event.department_id != null ? String(event.department_id) : "",
    noteDepartment: event.note_department ?? "",
    date: toDateInputValue(event.date),
    time: toTimeInputValue(event.time),
    duration: event.duration != null ? String(event.duration) : "",
  };
}

export function mapTestToFormValues(test: TestType) {
  return {
    title: test.title ?? "",
    description: test.description ?? "",
    link: test.link ?? "",
    positionId: test.position_id != null ? String(test.position_id) : "",
    notePosition: test.note_position ?? "",
    date: toDateInputValue(test.date),
    duration: test.duration != null ? String(test.duration) : "",
  };
}

export function mapWebinarToFormValues(webinar: WebinarType) {
  return {
    title: webinar.title ?? "",
    description: webinar.description ?? "",
    link: webinar.link ?? "",
    date: toDateInputValue(webinar.date),
    time: toTimeInputValue(webinar.time),
    duration: webinar.duration != null ? String(webinar.duration) : "",
  };
}
