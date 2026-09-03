import { RouteObject } from "react-router-dom";
import { ROUTES } from "@/constants/routes.ts";
import MainLayout from "@/layouts/MainLayout";
import { lazyPage } from "./lazyPage.tsx";

export const servicesRoutes: RouteObject = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTES.EMPLOYEES,
      element: lazyPage(
        () =>
          import("@/pages/Services/EmployeeDirectory/EmployeeDirectory.tsx"),
        "Справочник сотрудника",
      ),
    },
  ],
};
