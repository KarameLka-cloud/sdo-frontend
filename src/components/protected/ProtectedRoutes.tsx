import { ReactElement } from "react";
import Cookie from "js-cookie";
import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser.ts";
import { ROUTES } from "@/constants/routes.ts";
import {
  hasAnyRoleFromUser,
  USER_ROLES,
  MENTOR_ACCESS_ROLES,
  type UserRole,
} from "@/constants/roles.ts";
import { COOKIE_NAMES } from "@/constants/api.ts";
import { useGetUserByDataQuery } from "@/services/store/features/user.ts";

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
      return;
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

interface RoleGuardProps {
  allowedRoles: readonly UserRole[];
  children?: ReactElement;
}

function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, role_name: roleName, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!hasAnyRoleFromUser(role, roleName, allowedRoles)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

interface ProtectedRouteAdminProps {
  elementAdmin?: ReactElement;
}

const ProtectedRouteAdmin = ({ elementAdmin }: ProtectedRouteAdminProps) => (
  <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>{elementAdmin}</RoleGuard>
);

interface ProtectedRouteMentorProps {
  elementMentor?: ReactElement;
}

const ProtectedRouteMentor = ({ elementMentor }: ProtectedRouteMentorProps) => (
  <RoleGuard allowedRoles={MENTOR_ACCESS_ROLES}>{elementMentor}</RoleGuard>
);

export { ProtectedRoute, ProtectedRouteAdmin, ProtectedRouteMentor, RoleGuard };
