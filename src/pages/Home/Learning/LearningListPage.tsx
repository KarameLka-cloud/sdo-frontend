import { JSX, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import DataList from "@/components/ui/custom/DataList";
import UniversalCard from "@/components/ui/custom/UniversalCard";
import {
  LearningCategory,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import {
  LEARNING_TYPE_LABELS,
  buildLearningPath,
  resolveLearningRoute,
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
  const route = resolveLearningRoute(
    searchParams.get("category"),
    searchParams.get("type"),
    buildLearningPath,
  );

  if ("redirect" in route) {
    return <Navigate to={route.redirect} replace />;
  }

  return <LearningListContent category={route.category} type={route.type} />;
}

export default LearningListPage;
