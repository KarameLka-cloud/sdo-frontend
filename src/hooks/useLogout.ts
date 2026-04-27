import { useLogoutMutation } from "../services/store/features/auth.ts";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes.ts";
import { COOKIE_NAMES } from "../constants/api.ts";

export const useLogout = () => {
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const clearSessionAndRedirect = () => {
    localStorage.clear();
    Cookie.remove(COOKIE_NAMES.AUTH_TOKEN);
    navigate(ROUTES.LOGIN);
  };

  const logout = async () => {
    const token = Cookie.get(COOKIE_NAMES.AUTH_TOKEN);

    if (!token) {
      clearSessionAndRedirect();
      return;
    }

    try {
      await logoutMutation("").unwrap();
      clearSessionAndRedirect();
    } catch (error: unknown) {
      // Если токен истек/невалиден, API вернет 401.
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === 401
      ) {
        clearSessionAndRedirect();
        return;
      }

      clearSessionAndRedirect();
    }
  };
  return { logout };
};
