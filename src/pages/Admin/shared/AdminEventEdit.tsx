import { FormEvent, JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EventType } from "@/interfaces/api/EventType.ts";
import { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import { useGetDepartmentsQuery } from "@/services/store/features/user.ts";
import {
  useGetEducationEventByIdQuery,
  useUpdateEducationEventMutation,
  useDeleteEducationEventMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoEventByIdQuery,
  useUpdateEdoEventMutation,
  useDeleteEdoEventMutation,
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
  EVENT_ROUTES,
  parseEntityId,
  toDateInputValue,
  toTimeInputValue,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";

const HOOKS = {
  education: {
    useGetByIdQuery: useGetEducationEventByIdQuery,
    useUpdateMutation: useUpdateEducationEventMutation,
    useDeleteMutation: useDeleteEducationEventMutation,
  },
  edo: {
    useGetByIdQuery: useGetEdoEventByIdQuery,
    useUpdateMutation: useUpdateEdoEventMutation,
    useDeleteMutation: useDeleteEdoEventMutation,
  },
} as const;

const DELETE_MESSAGES = {
  confirm: "Удалить мероприятие?",
  success: "Мероприятие удалено",
  error: "Не удалось удалить мероприятие",
};

function AdminEventEdit({ domain }: { domain: AdminDomain }): JSX.Element {
  const navigate = useNavigate();
  const routes = EVENT_ROUTES[domain];
  const { eventId } = useParams();
  const id = parseEntityId(eventId);
  const { useGetByIdQuery, useUpdateMutation, useDeleteMutation } =
    HOOKS[domain];

  const {
    data: eventData,
    isLoading,
    isError,
  } = useGetByIdQuery(id!, { skip: id == null });
  const [updateEvent, { isLoading: isUpdating }] = useUpdateMutation();
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
  const [time, setTime] = useState("");

  const event = eventData as EventType | undefined;

  useEffect(() => {
    if (!event) return;
    setTitle(event.title);
    setDescription(event.description);
    setLink(event.link ?? "");
    setDepartmentId(event.department_id ? String(event.department_id) : "");
    setNoteDepartment(event.note_department ?? "");
    setDate(toDateInputValue(event.date));
    setTime(toTimeInputValue(event.time));
  }, [event]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (id == null) return;

    if (!title.trim()) return toast.error("Укажите название");
    if (!description.trim()) return toast.error("Укажите описание");
    if (!departmentId) return toast.error("Выберите отдел");
    if (!date) return toast.error("Укажите дату");

    try {
      await updateEvent({
        id,
        title: title.trim(),
        description: description.trim(),
        link: link.trim() || undefined,
        department_id: Number(departmentId),
        note_department: noteDepartment.trim() || undefined,
        date,
        time: time || undefined,
      }).unwrap();
      toast.success("Мероприятие сохранено");
      navigate(routes.list);
    } catch {
      toast.error("Не удалось сохранить мероприятие");
    }
  };

  if (id == null) {
    return (
      <AdminFormPage
        backTo={routes.list}
        backLabel="К списку мероприятий"
        isError
      >
        <></>
      </AdminFormPage>
    );
  }

  return (
    <AdminFormPage
      backTo={routes.list}
      backLabel="К списку мероприятий"
      isLoading={isLoading || isDepartmentsLoading}
      isError={isError || !event}
    >
      <Card>
        <CardHeader>
          <CardTitle>Редактирование мероприятия</CardTitle>
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
                <FieldLabel htmlFor="event-description">Описание</FieldLabel>
                <Input
                  id="event-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
              <div className="grid gap-4 sm:grid-cols-2">
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

export default AdminEventEdit;
