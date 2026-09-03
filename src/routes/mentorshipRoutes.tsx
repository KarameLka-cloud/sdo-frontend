import { RouteObject } from "react-router-dom";
import { ProtectedRouteMentor } from "@/components/protected/ProtectedRoutes.tsx";
import { ROUTES } from "@/constants/routes.ts";
import MainLayout from "@/layouts/MainLayout";
import { lazyPage } from "./lazyPage.tsx";

export const mentorshipRoutes: RouteObject = {
  element: <ProtectedRouteMentor elementMentor={<MainLayout />} />,
  children: [
    {
      path: ROUTES.MENTORSHIP_INTERNS,
      element: lazyPage(
        () => import("@/pages/Mentorship/Interns/Interns.tsx"),
        "Стажеры",
      ),
    },
    {
      path: ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT,
      element: lazyPage(
        () => import("@/pages/Mentorship/Interns/PlanEditor"),
        "Редактирование плана адаптации стажера",
      ),
    },
  ],
};
