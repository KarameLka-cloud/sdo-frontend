import { FormEvent, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import { useGetDepartmentsQuery } from "@/services/store/features/user.ts";
import { useAddEducationCourseMutation } from "@/services/store/features/education.ts";
import { useAddEdoCourseMutation } from "@/services/store/features/edo.ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Spinner } from "@/components/ui/spinner";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import {
  AdminDomain,
  COURSE_ROUTES,
} from "@/pages/Admin/shared/adminResourceConfig.ts";

const HOOKS = {
  education: useAddEducationCourseMutation,
  edo: useAddEdoCourseMutation,
} as const;

function AdminCourseCreate({ domain }: { domain: AdminDomain }): JSX.Element {
  const navigate = useNavigate();
  const routes = COURSE_ROUTES[domain];
  const useAddMutation = HOOKS[domain];
  const [addCourse, { isLoading: isCreating }] = useAddMutation();
  const { data: departments, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery("");

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [noteDepartment, setNoteDepartment] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return toast.error("Укажите название");
    if (!link.trim()) return toast.error("Укажите ссылку");
    if (!departmentId) return toast.error("Выберите отдел");
    if (!date) return toast.error("Укажите дату");
    if (!duration.trim() || Number(duration) < 1) {
      return toast.error("Укажите длительность в минутах");
    }

    try {
      await addCourse({
        title: title.trim(),
        link: link.trim(),
        department_id: Number(departmentId),
        note_department: noteDepartment.trim() || undefined,
        date,
        duration: Number(duration),
      }).unwrap();
      toast.success("Курс создан");
      navigate(routes.list);
    } catch {
      toast.error("Не удалось создать курс");
    }
  };

  return (
    <AdminFormPage
      backTo={routes.list}
      backLabel="К списку курсов"
      isLoading={isDepartmentsLoading}
    >
      <Card>
        <CardHeader>
          <CardTitle>Создание курса</CardTitle>
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
          <CardFooter>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Spinner />}
              Создать курс
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AdminFormPage>
  );
}

export default AdminCourseCreate;
