import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@components/protected/ProtectedRoutes.tsx";
import PageTitle from "@components/PageTitle.tsx";
import AuthLayout from "@layouts/AuthLayout/AuthLayout.tsx";
import DashboardLayout from "@layouts/DashboardLayout/DashboardLayout.tsx";
import Login from "@pages/Auth/Login/Login.tsx";
import { ROUTES } from "@constants/routes.ts";
import { homeRoutes } from "./homeRoutes.tsx";
import { adminRoutes } from "./adminRoutes.tsx";
import { mentorshipRoutes } from "./mentorshipRoutes.tsx";

const AppRoutes = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Navigate to={ROUTES.HOME} />,
  },
  {
    path: ROUTES.ADMIN,
    element: <Navigate to={ROUTES.ADMIN_USERS} />,
  },
  {
    path: ROUTES.MENTORSHIP,
    element: <Navigate to={ROUTES.MENTORSHIP_INTERNS} />,
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.HOME} replace />,
  },
  {
    element: <ProtectedRoute elementLogin={<AuthLayout />} route={"login"} />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <PageTitle title={"Авторизация"} element={<Login />} />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute
        elementDashboard={<DashboardLayout />}
        route={"dashboard"}
      />
    ),
    children: [
      homeRoutes,
      adminRoutes,
      mentorshipRoutes,
    ],
  },
]);

export default AppRoutes;
