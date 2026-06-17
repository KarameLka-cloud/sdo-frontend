import { FormEvent, JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { TestType } from "@/interfaces/api/TestType.ts";
import { PositionType } from "@/interfaces/api/PositionType.ts";
import { useGetPositionsQuery } from "@/services/store/features/user.ts";
import {
  useGetEducationTestByIdQuery,
  useUpdateEducationTestMutation,
  useDeleteEducationTestMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoTestByIdQuery,
  useUpdateEdoTestMutation,
  useDeleteEdoTestMutation,
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
  TEST_ROUTES,
  parseEntityId,
  toDateInputValue,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";

const HOOKS = {
  education: {
    useGetByIdQuery: useGetEducationTestByIdQuery,
    useUpdateMutation: useUpdateEducationTestMutation,
    useDeleteMutation: useDeleteEducationTestMutation,
  },
  edo: {
    useGetByIdQuery: useGetEdoTestByIdQuery,
    useUpdateMutation: useUpdateEdoTestMutation,
    useDeleteMutation: useDeleteEdoTestMutation,
  },
} as const;

const DELETE_MESSAGES = {
  confirm: "Удалить тест?",
  success: "Тест удалён",
  error: "Не удалось удалить тест",
};

function AdminTestEdit({ domain }: { domain: AdminDomain }): JSX.Element {
  const navigate = useNavigate();
  const routes = TEST_ROUTES[domain];
  const { testId } = useParams();
  const id = parseEntityId(testId);
  const { useGetByIdQuery, useUpdateMutation, useDeleteMutation } =
    HOOKS[domain];

  const {
    data: testData,
    isLoading,
    isError,
  } = useGetByIdQuery(id!, { skip: id == null });
  const [updateTest, { isLoading: isUpdating }] = useUpdateMutation();
  const deleteMutation = useDeleteMutation();
  const { handleDelete, isDeleting } = useAdminEditDelete(
    deleteMutation,
    DELETE_MESSAGES,
    () => navigate(routes.list),
  );
  const { data: positions, isLoading: isPositionsLoading } =
    useGetPositionsQuery("");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [positionId, setPositionId] = useState("");
  const [notePosition, setNotePosition] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const test = testData as TestType | undefined;

  useEffect(() => {
    if (!test) return;
    setTitle(test.title);
    setUrl(test.url);
    setPositionId(test.position_id ? String(test.position_id) : "");
    setNotePosition(test.note_position ?? "");
    setDateEnd(toDateInputValue(test.date_end));
  }, [test]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (id == null) return;

    if (!title.trim()) return toast.error("Укажите название");
    if (!url.trim()) return toast.error("Укажите ссылку");
    if (!positionId) return toast.error("Выберите должность");
    if (!dateEnd) return toast.error("Укажите дату окончания");

    try {
      await updateTest({
        id,
        title: title.trim(),
        url: url.trim(),
        position_id: Number(positionId),
        note_position: notePosition.trim() || undefined,
        date_end: dateEnd,
      }).unwrap();
      toast.success("Тест сохранён");
      navigate(routes.list);
    } catch {
      toast.error("Не удалось сохранить тест");
    }
  };

  if (id == null) {
    return (
      <AdminFormPage
        backTo={routes.list}
        backLabel="К списку тестов"
        isError
      >
        <></>
      </AdminFormPage>
    );
  }

  return (
    <AdminFormPage
      backTo={routes.list}
      backLabel="К списку тестов"
      isLoading={isLoading || isPositionsLoading}
      isError={isError || !test}
    >
      <Card>
        <CardHeader>
          <CardTitle>Редактирование теста</CardTitle>
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

export default AdminTestEdit;
