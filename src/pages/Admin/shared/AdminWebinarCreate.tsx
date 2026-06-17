import { FormEvent, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAddEducationWebinarMutation } from "@/services/store/features/education.ts";
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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import { WEBINAR_ROUTES } from "@/pages/Admin/shared/adminResourceConfig.ts";

function AdminWebinarCreate(): JSX.Element {
  const navigate = useNavigate();
  const [addWebinar, { isLoading: isCreating }] =
    useAddEducationWebinarMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return toast.error("Укажите название");
    if (!date) return toast.error("Укажите дату");
    if (!duration.trim() || Number(duration) < 1) {
      return toast.error("Укажите длительность в минутах");
    }

    try {
      await addWebinar({
        title: title.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        date,
        time: time || undefined,
        duration: Number(duration),
      }).unwrap();
      toast.success("Вебинар создан");
      navigate(WEBINAR_ROUTES.list);
    } catch {
      toast.error("Не удалось создать вебинар");
    }
  };

  return (
    <AdminFormPage
      backTo={WEBINAR_ROUTES.list}
      backLabel="К списку вебинаров"
    >
      <Card>
        <CardHeader>
          <CardTitle>Создание вебинара</CardTitle>
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
                <FieldLabel htmlFor="webinar-description">Описание</FieldLabel>
                <Textarea
                  id="webinar-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опционально"
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
          <CardFooter>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Spinner />}
              Создать вебинар
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AdminFormPage>
  );
}

export default AdminWebinarCreate;
