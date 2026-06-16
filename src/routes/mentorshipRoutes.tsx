import { RouteObject } from "react-router-dom";
import PageTitle from "@/components/PageTitle.tsx";
import {
  ProtectedRouteMentor,
  ProtectedRouteMentorshipInternsAdmin,
} from "@/components/protected/ProtectedRoutes.tsx";
import Interns from "@/pages/Mentorship/Interns/Interns.tsx";
import PlanCreate from "@/pages/Mentorship/Interns/PlanCreate.tsx";
import InternPlanEditor from "@/pages/Mentorship/Interns/PlanEditor";
import { ROUTES } from "@/constants/routes.ts";
import MainLayout from "@/layouts/MainLayout";

export const mentorshipRoutes: RouteObject = {
  element: <ProtectedRouteMentor elementMentor={<MainLayout />} />,
  children: [
    {
      path: ROUTES.MENTORSHIP_INTERNS,
      element: (
        <ProtectedRouteMentorshipInternsAdmin
          elementInternsAdmin={
            <PageTitle title={"Стажеры"} element={<Interns />} />
          }
        />
      ),
    },
    {
      path: ROUTES.MENTORSHIP_INTERNS_PLAN_CREATE,
      element: (
        <ProtectedRouteMentorshipInternsAdmin
          elementInternsAdmin={
            <PageTitle
              title={"Создание плана адаптации"}
              element={<PlanCreate />}
            />
          }
        />
      ),
    },
    {
      path: ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT,
      element: (
        <PageTitle
          title={"Редактирование плана адаптации стажера"}
          element={<InternPlanEditor />}
        />
      ),
    },
  ],
};
