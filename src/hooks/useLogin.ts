import {NavigateFunction, useNavigate} from "react-router-dom";
import Cookie from "js-cookie";
import {useLoginMutation} from "../services/store/features/auth.ts";
import {useState} from "react";

export const useLogin = () => {
    const navigate: NavigateFunction = useNavigate();
    const [login, {isLoading}] = useLoginMutation();
    const [errorMessage, setErrorMessage] = useState("");

    const loginUser = async (credentials: { login: string, password: string }) => {
        try {
            const response = await login(credentials).unwrap();
            Cookie.set("auth_token", response.auth_token);
            navigate("/");
        } catch (error: any) {
            console.log(error);
            setErrorMessage(error.data.message);
        }
    }
    return {loginUser, errorMessage, isLoading}
}
