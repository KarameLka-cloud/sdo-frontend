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
import { Separator } from "@/components/ui/shadcn/separator";
import { Spinner } from "@/components/ui/shadcn/spinner";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import {
  LEARNING_BACK_LABELS,
  buildAdminLearningPath,
  learningHasTime,
  learningNeedsDepartments,
  learningNeedsPositions,
  resolveLearningRoute,
} from "@/constants/learning.ts";
import LearningItemFormFields from "@/pages/Admin/Learning/LearningItemFormFields";
import {
  EMPTY_LEARNING_FORM,
  validateLearningItemForm,
  type LearningItemFormValues,
} from "@/pages/Admin/Learning/learningForm.ts";

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
  const needsDepartments = learningNeedsDepartments(type);
  const needsPositions = learningNeedsPositions(type);

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

  const [values, setValues] =
    useState<LearningItemFormValues>(EMPTY_LEARNING_FORM);
  const patchValues = (patch: Partial<LearningItemFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateLearningItemForm(type, values);
    if (validationError) return toast.error(validationError);

    try {
      await addItem({
        category,
        type,
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        link: values.link.trim() || undefined,
        department_id: needsDepartments
          ? Number(values.departmentId)
          : undefined,
        note_department: needsDepartments
          ? values.noteDepartment.trim() || undefined
          : undefined,
        position_id: needsPositions ? Number(values.positionId) : undefined,
        note_position: needsPositions
          ? values.notePosition.trim() || undefined
          : undefined,
        date: values.date,
        time: learningHasTime(type) ? values.time || undefined : undefined,
        duration: Number(values.duration),
      }).unwrap();
      toast.success(SUCCESS_MESSAGES[type]);
    } catch {
      toast.error(ERROR_MESSAGES[type]);
    }
  };

  return (
    <AdminFormPage
      backTo={listPath}
      backLabel={LEARNING_BACK_LABELS[type]}
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
            <LearningItemFormFields
              type={type}
              values={values}
              onChange={patchValues}
              departments={(departments ?? []) as DepartmentType[]}
              positions={(positions ?? []) as PositionType[]}
            />
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
  const route = resolveLearningRoute(
    searchParams.get("category"),
    searchParams.get("type"),
    buildAdminLearningPath,
  );

  if ("redirect" in route) {
    return <Navigate to={route.redirect} replace />;
  }

  return (
    <AdminLearningCreateContent category={route.category} type={route.type} />
  );
}

export default AdminLearningCreatePage;
