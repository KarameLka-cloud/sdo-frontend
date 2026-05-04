import { ReactElement } from "react";
import Cookie from "js-cookie";
import { Navigate } from "react-router-dom";
import { useUser } from "@hooks/useUser.ts";
import Loader from "@components/ui/Loader/Loader.tsx";
import { ROUTES } from "@constants/routes.ts";
import { hasRole, USER_ROLES } from "@constants/roles.ts";
import { COOKIE_NAMES } from "@constants/api.ts";

type GuardRouteType = "login" | "dashboard";

interface ProtectedRoutePropsType {
  elementLogin?: ReactElement;
  elementDashboard?: ReactElement;
  route?: GuardRouteType;
}

const ProtectedRoute = ({
  elementDashboard,
  elementLogin,
  route,
}: ProtectedRoutePropsType) => {
  // const {isLoading, error} = useGetUserByDataQuery("me");
  // ВРЕМЕННО: отключена проверка авторизации
  const isAuth = Boolean(Cookie.get(COOKIE_NAMES.AUTH_TOKEN));
  if (isAuth) {
    if (route === "login") {
      return <Navigate to={ROUTES.HOME} replace />;
    }
    // if (!isLoading) {
    //     if (error) {
    //         Cookie.remove("auth_token");
    //         return <Navigate to="login" replace/>
    //     }
    // }
    return elementDashboard;
  } else {
    if (route === "dashboard") {
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
    return elementLogin;
  }
  // return elementDashboard || elementLogin;
};

interface ProtectedRouteAdminProps {
  elementAdmin?: ReactElement;
}

interface ProtectedRouteMentorProps {
  elementMentor?: ReactElement;
}

interface ProtectedRouteMyInternsProps {
  elementMyInterns?: ReactElement;
}

interface ProtectedRouteMentorshipInternsAdminProps {
  elementInternsAdmin?: ReactElement;
}

const ProtectedRouteAdmin = ({ elementAdmin }: ProtectedRouteAdminProps) => {
  const { role, role_name: roleName, isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  const hasAdminAccess = hasRole(role, roleName, USER_ROLES.ADMIN);
  if (!hasAdminAccess) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return elementAdmin;
};

const ProtectedRouteMentor = ({ elementMentor }: ProtectedRouteMentorProps) => {
  const { role, role_name: roleName, isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  const hasAccess =
    hasRole(role, roleName, USER_ROLES.ADMIN) ||
    hasRole(role, roleName, USER_ROLES.MENTOR) ||
    hasRole(role, roleName, USER_ROLES.DEPARTMENT_HEAD);

  if (!hasAccess) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return elementMentor;
};

const ProtectedRouteMyInterns = ({
  elementMyInterns,
}: ProtectedRouteMyInternsProps) => {
  const { role, role_name: roleName, isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  const hasAccess =
    hasRole(role, roleName, USER_ROLES.MENTOR) ||
    hasRole(role, roleName, USER_ROLES.DEPARTMENT_HEAD);

  if (!hasAccess) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return elementMyInterns;
};

const ProtectedRouteMentorshipInternsAdmin = ({
  elementInternsAdmin,
}: ProtectedRouteMentorshipInternsAdminProps) => {
  const { role, role_name: roleName, isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  const hasAccess =
    hasRole(role, roleName, USER_ROLES.ADMIN) ||
    hasRole(role, roleName, USER_ROLES.MENTOR) ||
    hasRole(role, roleName, USER_ROLES.DEPARTMENT_HEAD);
  if (!hasAccess) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return elementInternsAdmin;
};

export {
  ProtectedRoute,
  ProtectedRouteAdmin,
  ProtectedRouteMentor,
  ProtectedRouteMyInterns,
  ProtectedRouteMentorshipInternsAdmin,
};
