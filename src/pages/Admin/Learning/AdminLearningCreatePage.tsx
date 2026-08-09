import { FormEvent, JSX, useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import { PositionType } from "@/interfaces/api/PositionType.ts";
import {
  LearningCategory,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import {
  useGetDepartmentsQuery,
  useGetPositionsQuery,
} from "@/services/store/features/user.ts";
import { useAddLearningItemMutation } from "@/services/store/features/learningItems.ts";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Separator } from "@/components/ui/shadcn/separator";
import { Spinner } from "@/components/ui/shadcn/spinner";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import {
  buildAdminLearningPath,
  isLearningCategory,
  isLearningType,
  isValidLearningPair,
} from "@/constants/learning.ts";

const TITLES: Record<LearningType, string> = {
  event: "Создание мероприятия",
  course: "Создание курса",
  webinar: "Создание вебинара",
  test: "Создание теста",
};

const SUBMIT_LABELS: Record<LearningType, string> = {
  event: "Создать мероприятие",
  course: "Создать курс",
  webinar: "Создать вебинар",
  test: "Создать тест",
};

const BACK_LABELS: Record<LearningType, string> = {
  event: "К списку мероприятий",
  course: "К списку курсов",
  webinar: "К списку вебинаров",
  test: "К списку тестов",
};

const SUCCESS_MESSAGES: Record<LearningType, string> = {
  event: "Мероприятие создано",
  course: "Курс создан",
  webinar: "Вебинар создан",
  test: "Тест создан",
};

const ERROR_MESSAGES: Record<LearningType, string> = {
  event: "Не удалось создать мероприятие",
  course: "Не удалось создать курс",
  webinar: "Не удалось создать вебинар",
  test: "Не удалось создать тест",
};

function AdminLearningCreateContent({
  category,
  type,
}: {
  category: LearningCategory;
  type: LearningType;
}): JSX.Element {
  const listPath = buildAdminLearningPath(category, type);
  const [addItem, { isLoading: isCreating }] = useAddLearningItemMutation();
  const needsDepartments = type === "event" || type === "course";
  const needsPositions = type === "test";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${TITLES[type]} - СДО`;
    return () => {
      document.title = previousTitle;
    };
  }, [type]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      await addItem({
        category,
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        department_id: needsDepartments ? Number(departmentId) : undefined,
        note_department: needsDepartments
          ? noteDepartment.trim() || undefined
          : undefined,
        position_id: needsPositions ? Number(positionId) : undefined,
        note_position: needsPositions
          ? notePosition.trim() || undefined
          : undefined,
        date,
        time:
          type === "event" || type === "webinar"
            ? time || undefined
            : undefined,
        duration: Number(duration),
      }).unwrap();
      toast.success(SUCCESS_MESSAGES[type]);
    } catch {
      toast.error(ERROR_MESSAGES[type]);
    }
  };

  return (
    <AdminFormPage
      backTo={listPath}
      backLabel={BACK_LABELS[type]}
      isLoading={
        (needsDepartments && isDepartmentsLoading) ||
        (needsPositions && isPositionsLoading)
      }
    >
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
                <FieldLabel htmlFor="learning-description">Описание</FieldLabel>
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
                    <FieldLabel htmlFor="learning-department">Отдел</FieldLabel>
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
                      <SelectTrigger id="learning-position" className="w-full">
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
          <CardFooter>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Spinner />}
              {SUBMIT_LABELS[type]}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AdminFormPage>
  );
}

function AdminLearningCreatePage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const typeParam = searchParams.get("type");

  if (!isLearningCategory(categoryParam) || !isLearningType(typeParam)) {
    return (
      <Navigate to={buildAdminLearningPath("education", "event")} replace />
    );
  }

  if (!isValidLearningPair(categoryParam, typeParam)) {
    return (
      <Navigate to={buildAdminLearningPath(categoryParam, "event")} replace />
    );
  }

  return (
    <AdminLearningCreateContent category={categoryParam} type={typeParam} />
  );
}

export default AdminLearningCreatePage;
