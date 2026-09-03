import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LearningCategory,
  LearningItemType,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import {
  useGetDepartmentsQuery,
  useGetPositionsQuery,
} from "@/services/store/features/organization.ts";
import {
  useAddLearningItemMutation,
  useDeleteLearningItemMutation,
  useUpdateLearningItemMutation,
} from "@/services/store/features/learningItems.ts";
import { Button } from "@/components/ui/shadcn/button";
import { Spinner } from "@/components/ui/shadcn/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import Loader from "@/components/ui/custom/Loader";
import {
  learningNeedsDepartments,
  learningNeedsPositions,
  LEARNING_DELETE_MESSAGES,
} from "@/constants/learning.ts";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import LearningItemFormFields from "@/pages/Admin/Learning/LearningItemFormFields";
import {
  EMPTY_LEARNING_FORM,
  LEARNING_CREATE_SUBMIT_LABELS,
  LEARNING_CREATE_TITLES,
  LEARNING_EDIT_TITLES,
  LEARNING_MESSAGES,
  toLearningItemFormValues,
  toLearningItemPayload,
  validateLearningItemForm,
  type LearningItemFormValues,
} from "@/pages/Admin/Learning/learningForm.ts";

function LearningItemFormDialog({
  open,
  onOpenChange,
  category,
  type,
  item = null,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: LearningCategory;
  type: LearningType;
  item?: LearningItemType | null;
}) {
  const isEdit = item != null;
  const [addItem, { isLoading: isCreating }] = useAddLearningItemMutation();
  const [updateItem, { isLoading: isUpdating }] =
    useUpdateLearningItemMutation();
  const { handleDelete, isDeleting } = useConfirmDelete(
    useDeleteLearningItemMutation(),
    {
      messages: LEARNING_DELETE_MESSAGES[type],
      onSuccess: () => onOpenChange(false),
      trackId: false,
    },
  );
  const needsDepartments = learningNeedsDepartments(type);
  const needsPositions = learningNeedsPositions(type);

  const { data: departments, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery(undefined, { skip: !open || !needsDepartments });
  const { data: positions, isLoading: isPositionsLoading } =
    useGetPositionsQuery(undefined, { skip: !open || !needsPositions });

  const [values, setValues] =
    useState<LearningItemFormValues>(EMPTY_LEARNING_FORM);
  const patchValues = (patch: Partial<LearningItemFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!open) {
      setValues(EMPTY_LEARNING_FORM);
      return;
    }
    setValues(item ? toLearningItemFormValues(item) : EMPTY_LEARNING_FORM);
  }, [open, item]);

  const isSaving = isCreating || isUpdating;
  const isBusy = isSaving || isDeleting;
  const isLoading =
    (needsDepartments && isDepartmentsLoading) ||
    (needsPositions && isPositionsLoading);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateLearningItemForm(type, values);
    if (validationError) return toast.error(validationError);

    try {
      if (isEdit) {
        await updateItem({
          id: item.id,
          ...toLearningItemPayload(values, { category, type, mode: "update" }),
        }).unwrap();
        toast.success(LEARNING_MESSAGES.update.success[type]);
      } else {
        await addItem(
          toLearningItemPayload(values, { category, type, mode: "create" }),
        ).unwrap();
        toast.success(LEARNING_MESSAGES.create.success[type]);
      }
      onOpenChange(false);
    } catch {
      toast.error(
        isEdit
          ? LEARNING_MESSAGES.update.error[type]
          : LEARNING_MESSAGES.create.error[type],
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>
            {isEdit ? LEARNING_EDIT_TITLES[type] : LEARNING_CREATE_TITLES[type]}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit
              ? "Измените данные записи и сохраните"
              : "Заполните данные новой записи"}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <LearningItemFormFields
                type={type}
                values={values}
                onChange={patchValues}
                departments={departments ?? []}
                positions={positions ?? []}
              />
            </div>
            <DialogFooter className={isEdit ? "justify-between" : undefined}>
              <Button type="submit" disabled={isBusy}>
                {isSaving && <Spinner />}
                {isEdit ? "Сохранить" : LEARNING_CREATE_SUBMIT_LABELS[type]}
              </Button>
              {isEdit && (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isBusy}
                  onClick={() => handleDelete(item.id)}
                >
                  {isDeleting && <Spinner />}
                  Удалить
                </Button>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default LearningItemFormDialog;
