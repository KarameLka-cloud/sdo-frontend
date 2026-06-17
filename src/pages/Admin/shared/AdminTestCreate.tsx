import { FormEvent, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PositionType } from "@/interfaces/api/PositionType.ts";
import { useGetPositionsQuery } from "@/services/store/features/user.ts";
import { useAddEducationTestMutation } from "@/services/store/features/education.ts";
import { useAddEdoTestMutation } from "@/services/store/features/edo.ts";
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
  TEST_ROUTES,
} from "@/pages/Admin/shared/adminResourceConfig.ts";

const HOOKS = {
  education: useAddEducationTestMutation,
  edo: useAddEdoTestMutation,
} as const;

function AdminTestCreate({ domain }: { domain: AdminDomain }): JSX.Element {
  const navigate = useNavigate();
  const routes = TEST_ROUTES[domain];
  const useAddMutation = HOOKS[domain];
  const [addTest, { isLoading: isCreating }] = useAddMutation();
  const { data: positions, isLoading: isPositionsLoading } =
    useGetPositionsQuery("");

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [positionId, setPositionId] = useState("");
  const [notePosition, setNotePosition] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return toast.error("Укажите название");
    if (!link.trim()) return toast.error("Укажите ссылку");
    if (!positionId) return toast.error("Выберите должность");
    if (!date) return toast.error("Укажите дату");
    if (!duration.trim() || Number(duration) < 1) {
      return toast.error("Укажите длительность в минутах");
    }

    try {
      await addTest({
        title: title.trim(),
        link: link.trim(),
        position_id: Number(positionId),
        note_position: notePosition.trim() || undefined,
        date,
        duration: Number(duration),
      }).unwrap();
      toast.success("Тест создан");
      navigate(routes.list);
    } catch {
      toast.error("Не удалось создать тест");
    }
  };

  return (
    <AdminFormPage
      backTo={routes.list}
      backLabel="К списку тестов"
      isLoading={isPositionsLoading}
    >
      <Card>
        <CardHeader>
          <CardTitle>Создание теста</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4">
              <Field>
                <FieldLabel htmlFor="test-title">Название</FieldLabel>
                <Input
                  id="test-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="test-link">Ссылка</FieldLabel>
                <Input
                  id="test-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="test-position">Должность</FieldLabel>
                  <Select value={positionId} onValueChange={setPositionId}>
                    <SelectTrigger id="test-position" className="w-full">
                      <SelectValue placeholder="Выберите должность" />
                    </SelectTrigger>
                    <SelectContent>
                      {((positions ?? []) as PositionType[]).map((position) => (
                        <SelectItem
                          key={position.id}
                          value={String(position.id)}
                        >
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="test-note">
                    Примечание по должности
                  </FieldLabel>
                  <Input
                    id="test-note"
                    value={notePosition}
                    onChange={(e) => setNotePosition(e.target.value)}
                    placeholder="Опционально"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="test-date">Пройти до</FieldLabel>
                  <Input
                    id="test-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="test-duration">
                    Длительность (мин.)
                  </FieldLabel>
                  <Input
                    id="test-duration"
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
              Создать тест
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AdminFormPage>
  );
}

export default AdminTestCreate;
