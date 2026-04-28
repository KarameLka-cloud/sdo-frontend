import { RouteObject } from "react-router-dom";
import PageTitle from "@components/PageTitle.tsx";
import { ProtectedRouteMentor } from "@components/protected/ProtectedRoutes.tsx";
import MentorshipLayout from "@layouts/DashboardLayout/MentorshipLayout/MentorshipLayout.tsx";
import Interns from "@pages/Mentorship/Interns/Interns.tsx";
import InternPlanEditor from "@pages/Mentorship/Interns/PlanEditor.tsx";
import MyInterns from "@pages/Mentorship/MyInterns/MyInterns.tsx";
import { ROUTES } from "@constants/routes.ts";

export const mentorshipRoutes: RouteObject = {
  element: <ProtectedRouteMentor elementMentor={<MentorshipLayout />} />,
  children: [
    {
      path: ROUTES.MENTORSHIP_INTERNS,
      element: <PageTitle title={"Стажеры"} element={<Interns />} />,
    },
    {
      path: ROUTES.MENTORSHIP_MY_INTERNS,
      element: <PageTitle title={"Мои стажеры"} element={<MyInterns />} />,
    },
    {
      path: ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT,
      element: (
        <PageTitle
          title={"Редактирование плана стажера"}
          element={<InternPlanEditor />}
        />
      ),
    },
  ],
};
