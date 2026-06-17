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
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  const webinar = webinarData as WebinarType | undefined;

  useEffect(() => {
    if (!webinar) return;
    setTitle(webinar.title);
    setLink(webinar.link ?? "");
    setDate(toDateInputValue(webinar.date));
    setTime(toTimeInputValue(webinar.time));
    setDuration(String(webinar.duration));
  }, [webinar]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (id == null) return;

    if (!title.trim()) return toast.error("Укажите название");
    if (!date) return toast.error("Укажите дату");
    if (!duration.trim() || Number(duration) < 1) {
      return toast.error("Укажите длительность в минутах");
    }

    try {
      await updateWebinar({
        id,
        title: title.trim(),
        link: link.trim() || undefined,
        date,
        time: time || undefined,
        duration: Number(duration),
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
              <Field>
                <FieldLabel htmlFor="webinar-link">Ссылка</FieldLabel>
                <Input
                  id="webinar-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Опционально"
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
                  <FieldLabel htmlFor="webinar-time">Время</FieldLabel>
                  <Input
                    id="webinar-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Опционально"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="webinar-duration">
                    Длительность (мин.)
                  </FieldLabel>
                  <Input
                    id="webinar-duration"
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

export default AdminWebinarEdit;
