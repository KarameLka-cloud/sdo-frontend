import { FormEvent, JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import { useGetDepartmentsQuery } from "@/services/store/features/user.ts";
import {
  useGetEducationCourseByIdQuery,
  useUpdateEducationCourseMutation,
  useDeleteEducationCourseMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoCourseByIdQuery,
  useUpdateEdoCourseMutation,
  useDeleteEdoCourseMutation,
} from "@/services/store/features/edo.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import AdminEditFormFooter from "@/pages/Admin/shared/components/AdminEditFormFooter";
import {
  AdminDomain,
  COURSE_ROUTES,
  parseEntityId,
  toDateInputValue,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";

const HOOKS = {
  education: {
    useGetByIdQuery: useGetEducationCourseByIdQuery,
    useUpdateMutation: useUpdateEducationCourseMutation,
    useDeleteMutation: useDeleteEducationCourseMutation,
  },
  edo: {
    useGetByIdQuery: useGetEdoCourseByIdQuery,
    useUpdateMutation: useUpdateEdoCourseMutation,
    useDeleteMutation: useDeleteEdoCourseMutation,
  },
} as const;

const DELETE_MESSAGES = {
  confirm: "Удалить курс?",
  success: "Курс удалён",
  error: "Не удалось удалить курс",
};

function AdminCourseEdit({ domain }: { domain: AdminDomain }): JSX.Element {
  const navigate = useNavigate();
  const routes = COURSE_ROUTES[domain];
  const { courseId } = useParams();
  const id = parseEntityId(courseId);
  const { useGetByIdQuery, useUpdateMutation, useDeleteMutation } =
    HOOKS[domain];

  const {
    data: courseData,
    isLoading,
    isError,
  } = useGetByIdQuery(id!, { skip: id == null });
  const [updateCourse, { isLoading: isUpdating }] = useUpdateMutation();
  const deleteMutation = useDeleteMutation();
  const { handleDelete, isDeleting } = useAdminEditDelete(
    deleteMutation,
    DELETE_MESSAGES,
    () => navigate(routes.list),
  );
  const { data: departments, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery("");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [noteDepartment, setNoteDepartment] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const course = courseData as CourseType | undefined;

  useEffect(() => {
    if (!course) return;
    setTitle(course.title);
    setUrl(course.url);
    setDepartmentId(course.department_id ? String(course.department_id) : "");
    setNoteDepartment(course.note_department ?? "");
    setDateEnd(toDateInputValue(course.date_end));
  }, [course]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (id == null) return;

    if (!title.trim()) return toast.error("Укажите название");
    if (!url.trim()) return toast.error("Укажите ссылку");
    if (!departmentId) return toast.error("Выберите отдел");
    if (!dateEnd) return toast.error("Укажите дату окончания");

    try {
      await updateCourse({
        id,
        title: title.trim(),
        url: url.trim(),
        department_id: Number(departmentId),
        note_department: noteDepartment.trim() || undefined,
        date_end: dateEnd,
      }).unwrap();
      toast.success("Курс сохранён");
      navigate(routes.list);
    } catch {
      toast.error("Не удалось сохранить курс");
    }
  };

  if (id == null) {
    return (
      <AdminFormPage
        backTo={routes.list}
        backLabel="К списку курсов"
        isError
      >
        <></>
      </AdminFormPage>
    );
  }

  return (
    <AdminFormPage
      backTo={routes.list}
      backLabel="К списку курсов"
      isLoading={isLoading || isDepartmentsLoading}
      isError={isError || !course}
    >
      <Card>
        <CardHeader>
          <CardTitle>Редактирование курса</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4">
              <Field>
                <FieldLabel htmlFor="course-title">Название</FieldLabel>
                <Input
                  id="course-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="course-url">Ссылка</FieldLabel>
                <Input
                  id="course-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="course-department">Отдел</FieldLabel>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                    <SelectTrigger id="course-department" className="w-full">
                      <SelectValue placeholder="Выберите отдел" />
                    </SelectTrigger>
                    <SelectContent>
                      {((departments ?? []) as DepartmentType[]).map((department) => (
                        <SelectItem
                          key={department.id}
                          value={String(department.id)}
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="course-note">
                    Примечание по отделу
                  </FieldLabel>
                  <Input
                    id="course-note"
                    value={noteDepartment}
                    onChange={(e) => setNoteDepartment(e.target.value)}
                    placeholder="Опционально"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="course-date-end">Пройти до</FieldLabel>
                <Input
                  id="course-date-end"
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </CardContent>
          <Separator />
          <AdminEditFormFooter
            isSaving={isUpdating}
            isDeleting={isDeleting}
            onDelete={() => handleDelete(id)}
          />
        </form>
      </Card>
    </AdminFormPage>
  );
}

export default AdminCourseEdit;
