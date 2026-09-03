import { RouteObject, Navigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle.tsx";
import Home from "@/pages/Home/Home";
import { ROUTES } from "@/constants/routes.ts";
import { buildLearningPath } from "@/constants/learning.ts";
import type {
  LearningCategory,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import MainLayout from "@/layouts/MainLayout";
import { lazyPage } from "./lazyPage.tsx";

/** Paths from the pre-query-param learning URLs, kept as permanent redirects. */
const LEGACY_LEARNING_PATHS: Array<
  [path: string, category: LearningCategory, type: LearningType]
> = [
  ["/education/events", "education", "event"],
  ["/education/courses", "education", "course"],
  ["/education/webinars", "education", "webinar"],
  ["/education/tests", "education", "test"],
  ["/edo/events", "edo", "event"],
  ["/edo/courses", "edo", "course"],
  ["/edo/tests", "edo", "test"],
];

export const homeRoutes: RouteObject = {
  element: <MainLayout />,
  children: [
    {
      // Landing route after sign-in: kept eager to avoid an extra round trip.
      path: ROUTES.HOME,
      element: <PageTitle title={"Главная"} element={<Home />} />,
    },
    {
      path: ROUTES.ADAPTATION,
      element: lazyPage(
        () => import("@/pages/Home/Adaptation/Adaptation.tsx"),
        "Адаптация",
      ),
    },
    {
      path: ROUTES.LEARNING,
      element: lazyPage(
        () => import("@/pages/Home/Learning/LearningListPage.tsx"),
      ),
    },
    ...LEGACY_LEARNING_PATHS.map(([path, category, type]) => ({
      path,
      element: <Navigate to={buildLearningPath(category, type)} replace />,
    })),
  ],
};
