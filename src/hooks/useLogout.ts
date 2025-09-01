import {useLogoutMutation} from "../services/store/features/auth.ts";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";

export const useLogout = () => {
    const navigate = useNavigate();
    const [logoutMutation] = useLogoutMutation();

    const logout = async () => {
        try {
            await logoutMutation("").unwrap();
            localStorage.clear();
            Cookie.remove("auth_token");
            navigate("login");
        } catch (error: any) {
            localStorage.clear();
            Cookie.remove("auth_token");
            navigate("login");
        }
    }
    return {logout};
}
