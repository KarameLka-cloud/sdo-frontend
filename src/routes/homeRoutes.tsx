import { RouteObject, Navigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle.tsx";
import Home from "@/pages/Home/Home";
import Adaptation from "@/pages/Home/Adaptation/Adaptation.tsx";
import LearningListPage from "@/pages/Home/Learning/LearningListPage.tsx";
import { ROUTES } from "@/constants/routes.ts";
import { buildLearningPath } from "@/constants/learning.ts";
import MainLayout from "@/layouts/MainLayout";

export const homeRoutes: RouteObject = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTES.HOME,
      element: <PageTitle title={"Главная"} element={<Home />} />,
    },
    {
      path: ROUTES.ADAPTATION,
      element: <PageTitle title={"Адаптация"} element={<Adaptation />} />,
    },
    {
      path: ROUTES.LEARNING,
      element: <LearningListPage />,
    },
    {
      path: "/education/events",
      element: (
        <Navigate to={buildLearningPath("education", "event")} replace />
      ),
    },
    {
      path: "/education/courses",
      element: (
        <Navigate to={buildLearningPath("education", "course")} replace />
      ),
    },
    {
      path: "/education/webinars",
      element: (
        <Navigate to={buildLearningPath("education", "webinar")} replace />
      ),
    },
    {
      path: "/education/tests",
      element: <Navigate to={buildLearningPath("education", "test")} replace />,
    },
    {
      path: "/edo/events",
      element: <Navigate to={buildLearningPath("edo", "event")} replace />,
    },
    {
      path: "/edo/courses",
      element: <Navigate to={buildLearningPath("edo", "course")} replace />,
    },
    {
      path: "/edo/tests",
      element: <Navigate to={buildLearningPath("edo", "test")} replace />,
    },
  ],
};
