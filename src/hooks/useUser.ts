import { UserType } from "../interfaces/api/UserType.ts";
import { LOCAL_STORAGE_NAMES } from "../constants/api.ts";

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

  const user = getUserFromStorage();

  return {
    name: user.name || "",
    department: user.department || "",
    description: user.description || "",
    role: user.role || "",
    role_name: user.role_name || "",
  };
};
