import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/services/store/features/auth.ts";
import { ROUTES } from "@/constants/routes.ts";
import { COOKIE_NAMES } from "@/constants/api.ts";

export const useLogout = () => {
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const clearSessionAndRedirect = () => {
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
    } catch {
      // Always clear local session, even if the API call fails.
    }

    clearSessionAndRedirect();
  };

  return { logout };
};
