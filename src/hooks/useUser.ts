import { UserType } from "../interfaces/api/UserType.ts";
import { COOKIE_NAMES, LOCAL_STORAGE_NAMES } from "../constants/api.ts";
import { useGetUserByDataQuery } from "../services/store/features/user.ts";
import Cookie from "js-cookie";
import { useEffect } from "react";

export const useUser = () => {
  const getUserFromStorage = (): UserType => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_NAMES.USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      return {};
    }
    return {};
  };

  const token = Cookie.get(COOKIE_NAMES.AUTH_TOKEN);
  const storedUser = getUserFromStorage();

  const { data, isLoading } = useGetUserByDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const user = (data as UserType | undefined) ?? storedUser;

  useEffect(() => {
    if (data) {
      localStorage.setItem(LOCAL_STORAGE_NAMES.USER, JSON.stringify(data));
    }
  }, [data]);

  return {
    name: user.name || "",
    department: user.department || "",
    description: user.description || "",
    role: user.role || "",
    role_name: user.role_name || "",
    isLoading,
  };
};
