import Cookie from "js-cookie";
import { COOKIE_NAMES } from "@/constants/api.ts";
import { useGetCurrentUserQuery } from "@/services/store/features/users.ts";

/** Single source of truth for the signed-in user; skipped when no token is set. */
export const useUser = () => {
  const hasToken = Boolean(Cookie.get(COOKIE_NAMES.AUTH_TOKEN));
  const { data, isLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: !hasToken,
  });

  return {
    id: data?.id,
    name: data?.name ?? "",
    department: data?.department ?? "",
    description: data?.description ?? "",
    role: data?.role ?? "",
    role_name: data?.role_name ?? "",
    hasToken,
    isLoading,
    error,
  };
};
