import { FormEvent, JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import {
  useGetEducationWebinarByIdQuery,
  useUpdateEducationWebinarMutation,
  useDeleteEducationWebinarMutation,
} from "@/services/store/features/education.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import AdminEditFormFooter from "@/pages/Admin/shared/components/AdminEditFormFooter";
import {
  WEBINAR_ROUTES,
  parseEntityId,
  toDateInputValue,
  toTimeInputValue,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";

const DELETE_MESSAGES = {
  confirm: "Удалить вебинар?",
  success: "Вебинар удалён",
  error: "Не удалось удалить вебинар",
};

function AdminWebinarEdit(): JSX.Element {
  const navigate = useNavigate();
  const { webinarId } = useParams();
  const id = parseEntityId(webinarId);

  const {
    data: webinarData,
    isLoading,
    isError,
  } = useGetEducationWebinarByIdQuery(id!, { skip: id == null });
  const [updateWebinar, { isLoading: isUpdating }] =
    useUpdateEducationWebinarMutation();
  const deleteMutation = useDeleteEducationWebinarMutation();
  const { handleDelete, isDeleting } = useAdminEditDelete(
    deleteMutation,
    DELETE_MESSAGES,
    () => navigate(WEBINAR_ROUTES.list),
  );

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const webinar = webinarData as WebinarType | undefined;

  useEffect(() => {
    if (!webinar) return;
    setTitle(webinar.title);
    setDate(toDateInputValue(webinar.date));
    setTimeStart(toTimeInputValue(webinar.time_start));
    setTimeEnd(toTimeInputValue(webinar.time_end));
  }, [webinar]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (id == null) return;

    if (!title.trim()) return toast.error("Укажите название");
    if (!date) return toast.error("Укажите дату");
    if (!timeStart) return toast.error("Укажите время начала");
    if (!timeEnd) return toast.error("Укажите время окончания");

    try {
      await updateWebinar({
        id,
        title: title.trim(),
        date,
        time_start: timeStart,
        time_end: timeEnd,
      }).unwrap();
      toast.success("Вебинар сохранён");
      navigate(WEBINAR_ROUTES.list);
    } catch {
      toast.error("Не удалось сохранить вебинар");
    }
  };

  if (id == null) {
    return (
      <AdminFormPage
        backTo={WEBINAR_ROUTES.list}
        backLabel="К списку вебинаров"
        isError
      >
        <></>
      </AdminFormPage>
    );
  }

  return (
    <AdminFormPage
      backTo={WEBINAR_ROUTES.list}
      backLabel="К списку вебинаров"
      isLoading={isLoading}
      isError={isError || !webinar}
    >
      <Card>
        <CardHeader>
          <CardTitle>Редактирование вебинара</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4">
              <Field>
                <FieldLabel htmlFor="webinar-title">Название</FieldLabel>
                <Input
                  id="webinar-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="webinar-date">Дата</FieldLabel>
                  <Input
                    id="webinar-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="webinar-time-start">
                    Время начала
                  </FieldLabel>
                  <Input
                    id="webinar-time-start"
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="webinar-time-end">
                    Время окончания
                  </FieldLabel>
                  <Input
                    id="webinar-time-end"
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
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

export default AdminWebinarEdit;
