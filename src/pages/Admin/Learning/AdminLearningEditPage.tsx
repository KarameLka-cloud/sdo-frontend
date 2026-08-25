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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Separator } from "@/components/ui/shadcn/separator";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import AdminEditFormFooter from "@/pages/Admin/shared/components/AdminEditFormFooter";
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";
import { usePopulateEditForm } from "@/pages/Admin/shared/usePopulateEditForm.ts";
import {
  LEARNING_BACK_LABELS,
  LEARNING_DELETE_MESSAGES,
  buildAdminLearningPath,
  learningHasTime,
  learningNeedsDepartments,
  learningNeedsPositions,
} from "@/constants/learning.ts";
import {
  parseEntityId,
  toDateInputValue,
  toTimeInputValue,
} from "@/utils/formValues.ts";
import LearningItemFormFields from "@/pages/Admin/Learning/LearningItemFormFields";
import {
  EMPTY_LEARNING_FORM,
  validateLearningItemForm,
  type LearningItemFormValues,
} from "@/pages/Admin/Learning/learningForm.ts";

const TITLES = {
  event: "Редактирование мероприятия",
  course: "Редактирование курса",
  webinar: "Редактирование вебинара",
  test: "Редактирование теста",
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
    type ? LEARNING_DELETE_MESSAGES[type] : LEARNING_DELETE_MESSAGES.event,
    () => navigate(listPath),
  );

  const needsDepartments = type ? learningNeedsDepartments(type) : false;
  const needsPositions = type ? learningNeedsPositions(type) : false;

  const { data: departments, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery("", { skip: !type || !needsDepartments });
  const { data: positions, isLoading: isPositionsLoading } =
    useGetPositionsQuery("", { skip: !type || !needsPositions });

  const [values, setValues] =
    useState<LearningItemFormValues>(EMPTY_LEARNING_FORM);
  const patchValues = (patch: Partial<LearningItemFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const populateForm = useCallback((value: LearningItemType) => {
    setValues({
      title: value.title ?? "",
      description: value.description ?? "",
      link: value.link ?? "",
      departmentId:
        value.department_id != null ? String(value.department_id) : "",
      noteDepartment: value.note_department ?? "",
      positionId: value.position_id != null ? String(value.position_id) : "",
      notePosition: value.note_position ?? "",
      date: toDateInputValue(value.date),
      time: toTimeInputValue(value.time),
      duration: value.duration != null ? String(value.duration) : "",
    });
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

    const validationError = validateLearningItemForm(type, values);
    if (validationError) return toast.error(validationError);

    try {
      await updateItem({
        id,
        category,
        type,
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        link: values.link.trim() || undefined,
        department_id: needsDepartments ? Number(values.departmentId) : null,
        note_department: needsDepartments
          ? values.noteDepartment.trim() || undefined
          : null,
        position_id: needsPositions ? Number(values.positionId) : null,
        note_position: needsPositions
          ? values.notePosition.trim() || undefined
          : null,
        date: values.date,
        time: learningHasTime(type) ? values.time || undefined : null,
        duration: Number(values.duration),
      }).unwrap();
      toast.success(SUCCESS_MESSAGES[type]);
      navigate(listPath);
    } catch {
      toast.error(ERROR_MESSAGES[type]);
    }
  };

  if (id == null) {
    return <AdminFormPage backTo={listPath} backLabel="К списку" isError />;
  }

  return (
    <AdminFormPage
      backTo={listPath}
      backLabel={type ? LEARNING_BACK_LABELS[type] : "К списку"}
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
              <LearningItemFormFields
                type={type}
                values={values}
                onChange={patchValues}
                departments={(departments ?? []) as DepartmentType[]}
                positions={(positions ?? []) as PositionType[]}
              />
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
