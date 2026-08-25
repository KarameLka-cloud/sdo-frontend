import { FormEvent, JSX, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
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
import ResourceFormPage from "@/components/resource-list/ResourceFormPage";
import ResourceEditFormFooter from "@/components/resource-list/ResourceEditFormFooter";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import { usePopulateEditForm } from "@/components/resource-list/usePopulateEditForm";
import {
  LEARNING_BACK_LABELS,
  LEARNING_DELETE_MESSAGES,
  buildAdminLearningPath,
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
  LEARNING_EDIT_TITLES,
  LEARNING_MESSAGES,
  toLearningItemPayload,
  validateLearningItemForm,
  type LearningItemFormValues,
} from "@/pages/Admin/Learning/learningForm.ts";
import PageTitle from "@/components/PageTitle.tsx";

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
    itemData && itemData.id === id ? itemData : undefined;
  const type = item?.type;
  const category = item?.category;
  const listPath =
    category && type
      ? buildAdminLearningPath(category, type)
      : buildAdminLearningPath("education", "event");

  const { handleDelete, isDeleting } = useConfirmDelete(deleteMutation, {
    messages: type
      ? LEARNING_DELETE_MESSAGES[type]
      : LEARNING_DELETE_MESSAGES.event,
    onSuccess: () => navigate(listPath),
    trackId: false,
  });

  const needsDepartments = type ? learningNeedsDepartments(type) : false;
  const needsPositions = type ? learningNeedsPositions(type) : false;

  const { data: departments, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery(undefined, { skip: !type || !needsDepartments });
  const { data: positions, isLoading: isPositionsLoading } =
    useGetPositionsQuery(undefined, { skip: !type || !needsPositions });

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
      await updateItem(
        toLearningItemPayload(values, {
          category,
          type,
          id,
          mode: "update",
        }),
      ).unwrap();
      toast.success(LEARNING_MESSAGES.update.success[type]);
      navigate(listPath);
    } catch {
      toast.error(LEARNING_MESSAGES.update.error[type]);
    }
  };

  if (id == null) {
    return <ResourceFormPage backTo={listPath} backLabel="К списку" isError />;
  }

  return (
    <PageTitle
      title={type ? LEARNING_EDIT_TITLES[type] : "Редактирование"}
      element={
        <ResourceFormPage
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
                <CardTitle>{LEARNING_EDIT_TITLES[type]}</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="p-4">
                  <LearningItemFormFields
                    type={type}
                    values={values}
                    onChange={patchValues}
                    departments={departments ?? []}
                    positions={positions ?? []}
                  />
                </CardContent>
                <Separator />
                <ResourceEditFormFooter
                  isSaving={isUpdating}
                  isDeleting={isDeleting}
                  onDelete={() => handleDelete(id)}
                />
              </form>
            </Card>
          )}
        </ResourceFormPage>
      }
    />
  );
}

export default AdminLearningEditPage;
