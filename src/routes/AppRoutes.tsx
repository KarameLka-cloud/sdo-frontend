import { createBrowserRouter, Navigate } from "react-router-dom";
import Cookie from "js-cookie";
import { ProtectedRoute } from "@/components/protected/ProtectedRoutes.tsx";
import PageTitle from "@/components/PageTitle.tsx";
import AuthLayout from "@/layouts/AuthLayout.tsx";
import HomeLayout from "@/layouts/HomeLayout.tsx";
import Login from "@/pages/Auth/Login.tsx";
import { COOKIE_NAMES } from "@/constants/api.ts";
import { ROUTES } from "@/constants/routes.ts";
import { useUser } from "@/hooks/useUser.ts";
import { hasRole, USER_ROLES } from "@/constants/roles.ts";
import { homeRoutes } from "./homeRoutes.tsx";
import { adminRoutes } from "./adminRoutes.tsx";
import { mentorshipRoutes } from "./mentorshipRoutes.tsx";

function MentorshipRedirect() {
  const token = Cookie.get(COOKIE_NAMES.AUTH_TOKEN);
  const { role, role_name: roleName, isLoading } = useUser();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isLoading) {
    return null;
  }

  if (
    hasRole(role, roleName, USER_ROLES.ADMIN) ||
    hasRole(role, roleName, USER_ROLES.MENTOR) ||
    hasRole(role, roleName, USER_ROLES.DEPARTMENT_HEAD)
  ) {
    return <Navigate to={ROUTES.MENTORSHIP_INTERNS} replace />;
  }

  return <Navigate to={ROUTES.HOME} replace />;
}

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
    element: <MentorshipRedirect />,
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
    element: <ProtectedRoute elementHome={<HomeLayout />} route={"home"} />,
    children: [homeRoutes, adminRoutes, mentorshipRoutes],
  },
]);

export default AppRoutes;
