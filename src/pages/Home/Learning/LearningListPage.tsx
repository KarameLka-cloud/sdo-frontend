import { JSX } from "react";
import { Navigate } from "react-router-dom";
import DataList from "@/components/ui/custom/DataList";
import UniversalCard from "@/components/ui/custom/UniversalCard";
import PageTitle from "@/components/PageTitle.tsx";
import {
  LearningCategory,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import {
  LEARNING_TYPE_LABELS,
  buildLearningPath,
} from "@/constants/learning.ts";
import { useGetLearningItemsQuery } from "@/services/store/features/learningItems.ts";
import { useResolvedLearningRoute } from "@/hooks/useResolvedLearningRoute.ts";

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

  return (
    <PageTitle
      title={LEARNING_TYPE_LABELS[type]}
      element={
        <div className="flex min-h-0 flex-1 flex-col">
          <DataList
            data={data}
            error={!!error}
            isLoading={isLoading}
            renderItem={(item) => (
              <UniversalCard item={item} className="mt-4" />
            )}
          />
        </div>
      }
    />
  );
}

function LearningListPage(): JSX.Element {
  const route = useResolvedLearningRoute(buildLearningPath);

  if ("redirect" in route) {
    return <Navigate to={route.redirect} replace />;
  }

  return <LearningListContent category={route.category} type={route.type} />;
}

export default LearningListPage;
