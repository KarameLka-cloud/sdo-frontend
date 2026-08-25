import { useSearchParams } from "react-router-dom";
import {
  LearningCategory,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import { resolveLearningRoute } from "@/constants/learning.ts";

export function useResolvedLearningRoute(
  buildPath: (category: LearningCategory, type: LearningType) => string,
) {
  const [searchParams] = useSearchParams();
  return resolveLearningRoute(
    searchParams.get("category"),
    searchParams.get("type"),
    buildPath,
  );
}
