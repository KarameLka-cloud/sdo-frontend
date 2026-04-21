import {useLogoutMutation} from "../services/store/features/auth.ts";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../constants/routes.ts";
import {COOKIE_NAMES} from "../constants/api.ts";

export const useLogout = () => {
    const navigate = useNavigate();
    const [logoutMutation] = useLogoutMutation();

    const logout = async () => {
        try {
            await logoutMutation("").unwrap();
            localStorage.clear();
            Cookie.remove(COOKIE_NAMES.AUTH_TOKEN);
            navigate(ROUTES.LOGIN);
        } catch {
            localStorage.clear();
            Cookie.remove(COOKIE_NAMES.AUTH_TOKEN);
            navigate(ROUTES.LOGIN);
        }
    }
    return {logout};
}
