import { FormEvent, JSX, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
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
import { Separator } from "@/components/ui/shadcn/separator";
import { Spinner } from "@/components/ui/shadcn/spinner";
import ResourceFormPage from "@/components/resource-list/ResourceFormPage";
import {
  LEARNING_BACK_LABELS,
  buildAdminLearningPath,
  learningNeedsDepartments,
  learningNeedsPositions,
} from "@/constants/learning.ts";
import LearningItemFormFields from "@/pages/Admin/Learning/LearningItemFormFields";
import {
  EMPTY_LEARNING_FORM,
  LEARNING_CREATE_SUBMIT_LABELS,
  LEARNING_CREATE_TITLES,
  LEARNING_MESSAGES,
  toLearningItemPayload,
  validateLearningItemForm,
  type LearningItemFormValues,
} from "@/pages/Admin/Learning/learningForm.ts";
import { useResolvedLearningRoute } from "@/hooks/useResolvedLearningRoute.ts";
import PageTitle from "@/components/PageTitle.tsx";

function AdminLearningCreateContent({
  category,
  type,
}: {
  category: LearningCategory;
  type: LearningType;
}): JSX.Element {
  const listPath = buildAdminLearningPath(category, type);
  const [addItem, { isLoading: isCreating }] = useAddLearningItemMutation();
  const needsDepartments = learningNeedsDepartments(type);
  const needsPositions = learningNeedsPositions(type);

  const { data: departments, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery(undefined, { skip: !needsDepartments });
  const { data: positions, isLoading: isPositionsLoading } =
    useGetPositionsQuery(undefined, { skip: !needsPositions });

  const [values, setValues] =
    useState<LearningItemFormValues>(EMPTY_LEARNING_FORM);
  const patchValues = (patch: Partial<LearningItemFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateLearningItemForm(type, values);
    if (validationError) return toast.error(validationError);

    try {
      await addItem(
        toLearningItemPayload(values, { category, type, mode: "create" }),
      ).unwrap();
      toast.success(LEARNING_MESSAGES.create.success[type]);
    } catch {
      toast.error(LEARNING_MESSAGES.create.error[type]);
    }
  };

  return (
    <PageTitle
      title={LEARNING_CREATE_TITLES[type]}
      element={
        <ResourceFormPage
          backTo={listPath}
          backLabel={LEARNING_BACK_LABELS[type]}
          isLoading={
            (needsDepartments && isDepartmentsLoading) ||
            (needsPositions && isPositionsLoading)
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>{LEARNING_CREATE_TITLES[type]}</CardTitle>
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
              <CardFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && <Spinner />}
                  {LEARNING_CREATE_SUBMIT_LABELS[type]}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </ResourceFormPage>
      }
    />
  );
}

function AdminLearningCreatePage(): JSX.Element {
  const route = useResolvedLearningRoute(buildAdminLearningPath);

  if ("redirect" in route) {
    return <Navigate to={route.redirect} replace />;
  }

  return (
    <AdminLearningCreateContent category={route.category} type={route.type} />
  );
}

export default AdminLearningCreatePage;
