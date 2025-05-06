import api from "../api/api.ts";
import Cookie from "js-cookie";
import {AxiosError} from "axios";

export const logout = async () => {
    try {
        await api.post("api/auth/logout");
        Cookie.remove("auth_token");
        return {success: true};
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
            if (error.response && error.response.status === 401) {
                return {success: false};
            }
        }
    }
};
