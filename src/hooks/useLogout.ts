import Cookie from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/services/store/features/auth.ts";
import { baseApi } from "@/services/store/baseApi.ts";
import { ROUTES } from "@/constants/routes.ts";
import { COOKIE_NAMES } from "@/constants/api.ts";

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    if (Cookie.get(COOKIE_NAMES.AUTH_TOKEN)) {
      try {
        await logoutMutation().unwrap();
      } catch {
        // Always clear the local session, even if the API call fails.
      }
    }

    Cookie.remove(COOKIE_NAMES.AUTH_TOKEN);
    // Drop every cached response so the next sign-in starts clean.
    dispatch(baseApi.util.resetApiState());
    navigate(ROUTES.LOGIN);
  };

  return { logout };
};
