import { FormEvent, JSX, useCallback, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";
import { mapCourseToFormValues } from "@/pages/Admin/shared/adminEditFormMappers.ts";
import { usePopulateEditForm } from "@/pages/Admin/shared/usePopulateEditForm.ts";

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
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [noteDepartment, setNoteDepartment] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");

  const course =
    courseData && courseData.id === id ? (courseData as CourseType) : undefined;

  const populateForm = useCallback((item: CourseType) => {
    const values = mapCourseToFormValues(item);
    setTitle(values.title);
    setDescription(values.description);
    setLink(values.link);
    setDepartmentId(values.departmentId);
    setNoteDepartment(values.noteDepartment);
    setDate(values.date);
    setDuration(values.duration);
  }, []);

  const isFormPopulated = usePopulateEditForm(
    id,
    course,
    !isDepartmentsLoading,
    populateForm,
  );

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (id == null) return;

    if (!title.trim()) return toast.error("Укажите название");
    if (!link.trim()) return toast.error("Укажите ссылку");
    if (!departmentId) return toast.error("Выберите отдел");
    if (!date) return toast.error("Укажите дату");
    if (!duration.trim() || Number(duration) < 1) {
      return toast.error("Укажите длительность в минутах");
    }

    try {
      await updateCourse({
        id,
        title: title.trim(),
        description: description.trim() || undefined,
        link: link.trim(),
        department_id: Number(departmentId),
        note_department: noteDepartment.trim() || undefined,
        date,
        duration: Number(duration),
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
      isLoading={isLoading || isDepartmentsLoading || !isFormPopulated}
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
                <FieldLabel htmlFor="course-description">Описание</FieldLabel>
                <Textarea
                  id="course-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опционально"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="course-link">Ссылка</FieldLabel>
                <Input
                  id="course-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
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
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="course-date">Пройти до</FieldLabel>
                  <Input
                    id="course-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="course-duration">
                    Длительность (мин.)
                  </FieldLabel>
                  <Input
                    id="course-duration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </Field>
              </div>
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
