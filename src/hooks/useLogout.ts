import {useLogoutMutation} from "../services/store/features/auth.ts";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

export const useLogout = () => {
    const navigate = useNavigate();
    const [logoutMutation] = useLogoutMutation();

    const logout = async () => {
        try {
            await logoutMutation("").unwrap();
            Cookie.remove("auth_token");
            navigate("login");
        } catch (error) {
            const err = error as FetchBaseQueryError | SerializedError;
            console.error(err);
            Cookie.remove("auth_token");
            navigate("login");
        }
    }
    return {logout};
}
