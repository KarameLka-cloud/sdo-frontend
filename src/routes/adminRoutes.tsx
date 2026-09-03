import { RouteObject } from "react-router-dom";
import { ProtectedRouteAdmin } from "@/components/protected/ProtectedRoutes.tsx";
import { ROUTES } from "@/constants/routes.ts";
import MainLayout from "@/layouts/MainLayout";
import { lazyPage } from "./lazyPage.tsx";

export const adminRoutes: RouteObject = {
  element: <ProtectedRouteAdmin elementAdmin={<MainLayout />} />,
  children: [
    {
      path: ROUTES.ADMIN_USERS,
      element: lazyPage(
        () => import("@/pages/Admin/Users/Users.tsx"),
        "Пользователи",
      ),
    },
    {
      path: ROUTES.ADMIN_LEARNING,
      element: lazyPage(
        () => import("@/pages/Admin/Learning/AdminLearningListPage.tsx"),
      ),
    },
    {
      path: ROUTES.ADMIN_ADAPTATION_TEMPLATES,
      element: lazyPage(
        () => import("@/pages/Admin/Adaptation/Templates/Templates.tsx"),
        "Планы адаптации",
      ),
    },
    {
      path: ROUTES.ADMIN_ADAPTATION_TEMPLATE_TASKS,
      element: lazyPage(
        () =>
          import(
            "@/pages/Admin/Adaptation/Templates/TemplateTasks/TemplateTasks.tsx"
          ),
        "Редактирование плана адаптации",
      ),
    },
  ],
};
