import { RouteObject } from "react-router-dom";
import PageTitle from "@/components/PageTitle.tsx";
import { ProtectedRouteAdmin } from "@/components/protected/ProtectedRoutes.tsx";
import UsersAdmin from "@/pages/Admin/Users/Users.tsx";
import UserEditAdmin from "@/pages/Admin/Users/UserEdit.tsx";
import AdminLearningListPage from "@/pages/Admin/Learning/AdminLearningListPage.tsx";
import AdminLearningCreatePage from "@/pages/Admin/Learning/AdminLearningCreatePage.tsx";
import AdminLearningEditPage from "@/pages/Admin/Learning/AdminLearningEditPage.tsx";
import AdaptationTemplatesAdmin from "@/pages/Admin/Adaptation/Templates/Templates.tsx";
import AdaptationTemplateCreateAdmin from "@/pages/Admin/Adaptation/Templates/TemplateCreate.tsx";
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
      path: ROUTES.ADMIN_USER_EDIT,
      element: (
        <PageTitle
          title={"Редактирование пользователя"}
          element={<UserEditAdmin />}
        />
      ),
    },
    {
      path: ROUTES.ADMIN_LEARNING,
      element: <AdminLearningListPage />,
    },
    {
      path: ROUTES.ADMIN_LEARNING_CREATE,
      element: <AdminLearningCreatePage />,
    },
    {
      path: ROUTES.ADMIN_LEARNING_EDIT,
      element: <AdminLearningEditPage />,
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
      path: ROUTES.ADMIN_ADAPTATION_TEMPLATES_CREATE,
      element: (
        <PageTitle
          title={"Создание плана адаптации"}
          element={<AdaptationTemplateCreateAdmin />}
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
