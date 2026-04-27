import { UserType } from "../interfaces/api/UserType.ts";
import { COOKIE_NAMES } from "../constants/api.ts";
import { useGetUserByDataQuery } from "../services/store/features/user.ts";
import Cookie from "js-cookie";

export const useUser = () => {
  const token = Cookie.get(COOKIE_NAMES.AUTH_TOKEN);

  const { data, isLoading } = useGetUserByDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const user = (data as UserType | undefined) ?? {};

  return {
    name: user.name || "",
    department: user.department || "",
    description: user.description || "",
    role: user.role || "",
    role_name: user.role_name || "",
    isLoading,
  };
};
