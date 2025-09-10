import {NavigateFunction, useNavigate} from "react-router-dom";
import Cookie from "js-cookie";
import {useLoginMutation} from "../services/store/features/auth.ts";
import {useState} from "react";
import {ROUTES} from "../constants/routes.ts";
import {COOKIE_NAMES} from "../constants/api.ts";

export const useLogin = () => {
    const navigate: NavigateFunction = useNavigate();
    const [login, {isLoading}] = useLoginMutation();
    const [errorMessage, setErrorMessage] = useState("");

    const loginUser = async (credentials: { login: string, password: string }) => {
        try {
            const response = await login(credentials).unwrap();
            localStorage.setItem('user', JSON.stringify(response.user));
            Cookie.set(COOKIE_NAMES.AUTH_TOKEN, response.auth_token);
            navigate(ROUTES.ROOT);
        } catch (error: any) {
            console.log(error);
            setErrorMessage(error.data.message);
        }
    }
    return {loginUser, errorMessage, isLoading};
}
