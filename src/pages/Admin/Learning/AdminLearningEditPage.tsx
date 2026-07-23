import { FormEvent, JSX, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import { PositionType } from "@/interfaces/api/PositionType.ts";
import { LearningItemType } from "@/interfaces/api/LearningItemType.ts";
import {
  useGetDepartmentsQuery,
  useGetPositionsQuery,
} from "@/services/store/features/user.ts";
import {
  useDeleteLearningItemMutation,
  useGetLearningItemByIdQuery,
  useUpdateLearningItemMutation,
} from "@/services/store/features/learningItems.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";
import { usePopulateEditForm } from "@/pages/Admin/shared/usePopulateEditForm.ts";
import {
  buildAdminLearningPath,
  parseEntityId,
  toDateInputValue,
  toTimeInputValue,
} from "@/constants/learning.ts";

const TITLES = {
  event: "Редактирование мероприятия",
  course: "Редактирование курса",
  webinar: "Редактирование вебинара",
  test: "Редактирование теста",
} as const;

const BACK_LABELS = {
  event: "К списку мероприятий",
  course: "К списку курсов",
  webinar: "К списку вебинаров",
  test: "К списку тестов",
} as const;

const SUCCESS_MESSAGES = {
  event: "Мероприятие сохранено",
  course: "Курс сохранён",
  webinar: "Вебинар сохранён",
  test: "Тест сохранён",
} as const;

const ERROR_MESSAGES = {
  event: "Не удалось сохранить мероприятие",
  course: "Не удалось сохранить курс",
  webinar: "Не удалось сохранить вебинар",
  test: "Не удалось сохранить тест",
} as const;

const DELETE_MESSAGES = {
  event: {
    confirm: "Удалить мероприятие?",
    success: "Мероприятие удалено",
    error: "Не удалось удалить мероприятие",
  },
  course: {
    confirm: "Удалить курс?",
    success: "Курс удалён",
    error: "Не удалось удалить курс",
  },
  webinar: {
    confirm: "Удалить вебинар?",
    success: "Вебинар удалён",
    error: "Не удалось удалить вебинар",
  },
  test: {
    confirm: "Удалить тест?",
    success: "Тест удалён",
    error: "Не удалось удалить тест",
  },
} as const;

function AdminLearningEditPage(): JSX.Element {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = parseEntityId(idParam);

  const {
    data: itemData,
    isLoading,
    isError,
  } = useGetLearningItemByIdQuery(id!, { skip: id == null });
  const [updateItem, { isLoading: isUpdating }] =
    useUpdateLearningItemMutation();
  const deleteMutation = useDeleteLearningItemMutation();

  const item =
    itemData && itemData.id === id ? (itemData as LearningItemType) : undefined;
  const type = item?.type;
  const category = item?.category;
  const listPath =
    category && type
      ? buildAdminLearningPath(category, type)
      : buildAdminLearningPath("education", "event");

  useEffect(() => {
    if (!type) return;
    const previousTitle = document.title;
    document.title = `${TITLES[type]} - СДО`;
    return () => {
      document.title = previousTitle;
    };
  }, [type]);

  const { handleDelete, isDeleting } = useAdminEditDelete(
    deleteMutation,
    type ? DELETE_MESSAGES[type] : DELETE_MESSAGES.event,
    () => navigate(listPath),
  );

  const needsDepartments = type === "event" || type === "course";
  const needsPositions = type === "test";

  const { data: departments, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery("", { skip: !needsDepartments });
  const { data: positions, isLoading: isPositionsLoading } =
    useGetPositionsQuery("", { skip: !needsPositions });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [noteDepartment, setNoteDepartment] = useState("");
  const [positionId, setPositionId] = useState("");
  const [notePosition, setNotePosition] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  const populateForm = useCallback((value: LearningItemType) => {
    setTitle(value.title ?? "");
    setDescription(value.description ?? "");
    setLink(value.link ?? "");
    setDepartmentId(
      value.department_id != null ? String(value.department_id) : "",
    );
    setNoteDepartment(value.note_department ?? "");
    setPositionId(value.position_id != null ? String(value.position_id) : "");
    setNotePosition(value.note_position ?? "");
    setDate(toDateInputValue(value.date));
    setTime(toTimeInputValue(value.time));
    setDuration(value.duration != null ? String(value.duration) : "");
  }, []);

  const refsReady =
    (!needsDepartments || !isDepartmentsLoading) &&
    (!needsPositions || !isPositionsLoading);

  const isFormPopulated = usePopulateEditForm(
    id,
    item,
    refsReady,
    populateForm,
  );

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (id == null || !type || !category) return;

    if (!title.trim()) return toast.error("Укажите название");
    if ((type === "course" || type === "test") && !link.trim()) {
      return toast.error("Укажите ссылку");
    }
    if (needsDepartments && !departmentId) {
      return toast.error("Выберите отдел");
    }
    if (needsPositions && !positionId) {
      return toast.error("Выберите должность");
    }
    if (!date) return toast.error("Укажите дату");
    if (!duration.trim() || Number(duration) < 1) {
      return toast.error("Укажите длительность в минутах");
    }

    try {
      await updateItem({
        id,
        category,
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        department_id: needsDepartments ? Number(departmentId) : null,
        note_department: needsDepartments
          ? noteDepartment.trim() || undefined
          : null,
        position_id: needsPositions ? Number(positionId) : null,
        note_position: needsPositions ? notePosition.trim() || undefined : null,
        date,
        time: type === "event" || type === "webinar" ? time || undefined : null,
        duration: Number(duration),
      }).unwrap();
      toast.success(SUCCESS_MESSAGES[type]);
      navigate(listPath);
    } catch {
      toast.error(ERROR_MESSAGES[type]);
    }
  };

  if (id == null) {
    return (
      <AdminFormPage backTo={listPath} backLabel="К списку" isError>
        <></>
      </AdminFormPage>
    );
  }

  return (
    <AdminFormPage
      backTo={listPath}
      backLabel={type ? BACK_LABELS[type] : "К списку"}
      isLoading={
        isLoading ||
        (needsDepartments && isDepartmentsLoading) ||
        (needsPositions && isPositionsLoading) ||
        !isFormPopulated
      }
      isError={isError || !item || !type}
    >
      {type && (
        <Card>
          <CardHeader>
            <CardTitle>{TITLES[type]}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-4">
              <FieldGroup className="grid gap-4">
                <Field>
                  <FieldLabel htmlFor="learning-title">Название</FieldLabel>
                  <Input
                    id="learning-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="learning-description">
                    Описание
                  </FieldLabel>
                  <Textarea
                    id="learning-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Опционально"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="learning-link">
                    {type === "event" || type === "webinar"
                      ? "Ссылка на доп. материалы"
                      : "Ссылка"}
                  </FieldLabel>
                  <Input
                    id="learning-link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder={
                      type === "event" || type === "webinar"
                        ? "Опционально"
                        : undefined
                    }
                  />
                </Field>

                {needsDepartments && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="learning-department">
                        Отдел
                      </FieldLabel>
                      <Select
                        value={departmentId}
                        onValueChange={setDepartmentId}
                      >
                        <SelectTrigger
                          id="learning-department"
                          className="w-full"
                        >
                          <SelectValue placeholder="Выберите отдел" />
                        </SelectTrigger>
                        <SelectContent>
                          {((departments ?? []) as DepartmentType[]).map(
                            (department) => (
                              <SelectItem
                                key={department.id}
                                value={String(department.id)}
                              >
                                {department.name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="learning-note-department">
                        Примечание по отделу
                      </FieldLabel>
                      <Input
                        id="learning-note-department"
                        value={noteDepartment}
                        onChange={(e) => setNoteDepartment(e.target.value)}
                        placeholder="Опционально"
                      />
                    </Field>
                  </div>
                )}

                {needsPositions && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="learning-position">
                        Должность
                      </FieldLabel>
                      <Select value={positionId} onValueChange={setPositionId}>
                        <SelectTrigger
                          id="learning-position"
                          className="w-full"
                        >
                          <SelectValue placeholder="Выберите должность" />
                        </SelectTrigger>
                        <SelectContent>
                          {((positions ?? []) as PositionType[]).map(
                            (position) => (
                              <SelectItem
                                key={position.id}
                                value={String(position.id)}
                              >
                                {position.name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="learning-note-position">
                        Примечание
                      </FieldLabel>
                      <Input
                        id="learning-note-position"
                        value={notePosition}
                        onChange={(e) => setNotePosition(e.target.value)}
                        placeholder="Опционально"
                      />
                    </Field>
                  </div>
                )}

                <div
                  className={`grid gap-4 ${
                    type === "event" || type === "webinar"
                      ? "sm:grid-cols-3"
                      : "sm:grid-cols-2"
                  }`}
                >
                  <Field>
                    <FieldLabel htmlFor="learning-date">
                      {type === "course" || type === "test"
                        ? "Пройти до"
                        : "Дата"}
                    </FieldLabel>
                    <Input
                      id="learning-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Field>
                  {(type === "event" || type === "webinar") && (
                    <Field>
                      <FieldLabel htmlFor="learning-time">Время</FieldLabel>
                      <Input
                        id="learning-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="Опционально"
                      />
                    </Field>
                  )}
                  <Field>
                    <FieldLabel htmlFor="learning-duration">
                      Длительность (мин.)
                    </FieldLabel>
                    <Input
                      id="learning-duration"
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
      )}
    </AdminFormPage>
  );
}

export default AdminLearningEditPage;
