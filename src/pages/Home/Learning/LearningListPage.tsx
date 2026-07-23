import { JSX, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import DataList from "@/components/ui/custom/DataList";
import UniversalCard from "@/components/ui/custom/UniversalCard";
import DataMessage from "@/components/ui/custom/DataMessage";
import {
  LearningCategory,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import {
  buildLearningPath,
  isLearningCategory,
  isLearningType,
  isValidLearningPair,
  LEARNING_TYPE_LABELS,
} from "@/constants/learning.ts";
import { useGetLearningItemsQuery } from "@/services/store/features/learningItems.ts";

function LearningListContent({
  category,
  type,
}: {
  category: LearningCategory;
  type: LearningType;
}): JSX.Element {
  const { data, error, isLoading } = useGetLearningItemsQuery({
    category,
    type,
  });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${LEARNING_TYPE_LABELS[type]} - СДО`;
    return () => {
      document.title = previousTitle;
    };
  }, [type]);

  if (error) {
    return <DataMessage type="error" centered />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataList
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item) => <UniversalCard item={item} className="mt-4" />}
      />
    </div>
  );
}

function LearningListPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const typeParam = searchParams.get("type");

  if (!isLearningCategory(categoryParam) || !isLearningType(typeParam)) {
    return <Navigate to={buildLearningPath("education", "event")} replace />;
  }

  if (!isValidLearningPair(categoryParam, typeParam)) {
    return <Navigate to={buildLearningPath(categoryParam, "event")} replace />;
  }

  return <LearningListContent category={categoryParam} type={typeParam} />;
}

export default LearningListPage;
