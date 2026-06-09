import { ReactElement } from "react";
import Cookie from "js-cookie";
import { Navigate } from "react-router-dom";
import { useUser } from "@hooks/useUser.ts";
import Loader from "@components/ui/Loader/Loader.tsx";
import { ROUTES } from "@constants/routes.ts";
import { hasRole, USER_ROLES } from "@constants/roles.ts";
import { COOKIE_NAMES } from "@constants/api.ts";
import { useGetUserByDataQuery } from "@services/store/features/user.ts";

function isUnauthorizedError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: unknown }).status === 401
  );
}

type GuardRouteType = "login" | "home";

interface ProtectedRoutePropsType {
  elementLogin?: ReactElement;
  elementHome?: ReactElement;
  route?: GuardRouteType;
}

const ProtectedRoute = ({
  elementHome,
  elementLogin,
  route,
}: ProtectedRoutePropsType) => {
  const hasToken = Boolean(Cookie.get(COOKIE_NAMES.AUTH_TOKEN));
  const { isLoading, error } = useGetUserByDataQuery(undefined, {
    skip: !hasToken,
  });

  if (hasToken) {
    if (isLoading) {
      return <Loader />;
    }
    if (error && isUnauthorizedError(error)) {
      Cookie.remove(COOKIE_NAMES.AUTH_TOKEN);
      if (route === "login") {
        return elementLogin;
      }
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
    if (route === "login") {
      return <Navigate to={ROUTES.HOME} replace />;
    }
    return elementHome;
  }
  if (route === "home") {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return elementLogin;
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
