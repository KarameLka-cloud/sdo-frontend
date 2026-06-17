import { FormEvent, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import { useGetDepartmentsQuery } from "@/services/store/features/user.ts";
import { useAddEducationEventMutation } from "@/services/store/features/education.ts";
import { useAddEdoEventMutation } from "@/services/store/features/edo.ts";
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
import { Textarea } from "@/components/ui/textarea";
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
  EVENT_ROUTES,
} from "@/pages/Admin/shared/adminResourceConfig.ts";

const HOOKS = {
  education: useAddEducationEventMutation,
  edo: useAddEdoEventMutation,
} as const;

function AdminEventCreate({ domain }: { domain: AdminDomain }): JSX.Element {
  const navigate = useNavigate();
  const routes = EVENT_ROUTES[domain];
  const useAddMutation = HOOKS[domain];
  const [addEvent, { isLoading: isCreating }] = useAddMutation();
  const { data: departments, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [noteDepartment, setNoteDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return toast.error("Укажите название");
    if (!departmentId) return toast.error("Выберите отдел");
    if (!date) return toast.error("Укажите дату");
    if (!duration.trim() || Number(duration) < 1) {
      return toast.error("Укажите длительность в минутах");
    }

    try {
      await addEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        department_id: Number(departmentId),
        note_department: noteDepartment.trim() || undefined,
        date,
        time: time || undefined,
        duration: Number(duration),
      }).unwrap();
      toast.success("Мероприятие создано");
      navigate(routes.list);
    } catch {
      toast.error("Не удалось создать мероприятие");
    }
  };

  return (
    <AdminFormPage
      backTo={routes.list}
      backLabel="К списку мероприятий"
      isLoading={isDepartmentsLoading}
    >
      <Card>
        <CardHeader>
          <CardTitle>Создание мероприятия</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4">
              <Field>
                <FieldLabel htmlFor="event-title">Название</FieldLabel>
                <Input
                  id="event-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="event-description">
                  Описание
                </FieldLabel>
                <Textarea
                  id="event-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опционально"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="event-link">
                  Ссылка на доп. материалы
                </FieldLabel>
                <Input
                  id="event-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Опционально"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="event-department">Отдел</FieldLabel>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                    <SelectTrigger id="event-department" className="w-full">
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
                  <FieldLabel htmlFor="event-note">
                    Примечание по отделу
                  </FieldLabel>
                  <Input
                    id="event-note"
                    value={noteDepartment}
                    onChange={(e) => setNoteDepartment(e.target.value)}
                    placeholder="Опционально"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="event-date">Дата</FieldLabel>
                  <Input
                    id="event-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="event-time">Время</FieldLabel>
                  <Input
                    id="event-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Опционально"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="event-duration">
                    Длительность (мин.)
                  </FieldLabel>
                  <Input
                    id="event-duration"
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
              Создать мероприятие
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AdminFormPage>
  );
}

export default AdminEventCreate;
