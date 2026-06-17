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
  const [url, setUrl] = useState("");
  const [positionId, setPositionId] = useState("");
  const [notePosition, setNotePosition] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return toast.error("Укажите название");
    if (!url.trim()) return toast.error("Укажите ссылку");
    if (!positionId) return toast.error("Выберите должность");
    if (!dateEnd) return toast.error("Укажите дату окончания");

    try {
      await addTest({
        title: title.trim(),
        url: url.trim(),
        position_id: Number(positionId),
        note_position: notePosition.trim() || undefined,
        date_end: dateEnd,
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
                <FieldLabel htmlFor="test-url">Ссылка</FieldLabel>
                <Input
                  id="test-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
              <Field>
                <FieldLabel htmlFor="test-date-end">Пройти до</FieldLabel>
                <Input
                  id="test-date-end"
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </Field>
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
