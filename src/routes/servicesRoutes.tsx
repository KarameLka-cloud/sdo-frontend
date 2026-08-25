import { RouteObject } from "react-router-dom";
import PageTitle from "@/components/PageTitle.tsx";
import EmployeeDirectory from "@/pages/Services/EmployeeDirectory/EmployeeDirectory.tsx";
import { ROUTES } from "@/constants/routes.ts";
import MainLayout from "@/layouts/MainLayout";

export const servicesRoutes: RouteObject = {
  element: <MainLayout />,
  children: [
    {
      path: ROUTES.EMPLOYEES,
      element: (
        <PageTitle
          title={"Справочник сотрудника"}
          element={<EmployeeDirectory />}
        />
      ),
    },
  ],
};
