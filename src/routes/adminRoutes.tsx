import { RouteObject } from "react-router-dom";
import PageTitle from "@/components/PageTitle.tsx";
import { ProtectedRouteAdmin } from "@/components/protected/ProtectedRoutes.tsx";
import UsersAdmin from "@/pages/Admin/Users/Users.tsx";
import EducationCoursesAdmin from "@/pages/Admin/Education/Courses/Courses.tsx";
import EducationEventsAdmin from "@/pages/Admin/Education/Events/Events.tsx";
import EducationWebinarsAdmin from "@/pages/Admin/Education/Webinars/Webinars.tsx";
import EducationTestsAdmin from "@/pages/Admin/Education/Tests/Tests.tsx";
import EdoCoursesAdmin from "@/pages/Admin/Edo/Courses/Courses.tsx";
import EdoEventsAdmin from "@/pages/Admin/Edo/Events/Events.tsx";
import EdoTestsAdmin from "@/pages/Admin/Edo/Tests/Tests.tsx";
import AdaptationTemplatesAdmin from "@/pages/Admin/Adaptation/Templates/Templates.tsx";
import AdaptationTemplateTasksAdmin from "@/pages/Admin/Adaptation/Templates/TemplateTasks/TemplateTasks.tsx";
import { ROUTES } from "@/constants/routes.ts";
import MainLayout from "@/layouts/MainLayout";

export const adminRoutes: RouteObject = {
  element: <ProtectedRouteAdmin elementAdmin={<MainLayout />} />,
  children: [
    {
      path: ROUTES.ADMIN_USERS,
      element: <PageTitle title={"Пользователи"} element={<UsersAdmin />} />,
    },
    {
      path: ROUTES.ADMIN_EDUCATION_COURSE,
      element: (
        <PageTitle title={"Курсы"} element={<EducationCoursesAdmin />} />
      ),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_EVENTS,
      element: (
        <PageTitle title={"Мероприятия"} element={<EducationEventsAdmin />} />
      ),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_WEBINARS,
      element: (
        <PageTitle title={"Вебинары"} element={<EducationWebinarsAdmin />} />
      ),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_TESTS,
      element: <PageTitle title={"Тесты"} element={<EducationTestsAdmin />} />,
    },
    {
      path: ROUTES.ADMIN_EDO_COURSES,
      element: <PageTitle title={"Курсы"} element={<EdoCoursesAdmin />} />,
    },
    {
      path: ROUTES.ADMIN_EDO_EVENTS,
      element: <PageTitle title={"Мероприятия"} element={<EdoEventsAdmin />} />,
    },
    {
      path: ROUTES.ADMIN_EDO_TESTS,
      element: <PageTitle title={"Тесты"} element={<EdoTestsAdmin />} />,
    },
    {
      path: ROUTES.ADMIN_ADAPTATION_TEMPLATES,
      element: (
        <PageTitle
          title={"Планы адаптации"}
          element={<AdaptationTemplatesAdmin />}
        />
      ),
    },
    {
      path: ROUTES.ADMIN_ADAPTATION_TEMPLATE_TASKS,
      element: (
        <PageTitle
          title={"Редактирование плана адаптации"}
          element={<AdaptationTemplateTasksAdmin />}
        />
      ),
    },
  ],
};
