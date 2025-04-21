import api from "../api/api.ts";
import Cookie from "js-cookie";
import { AxiosError } from "axios";

export const login = async (loginFormData: object) => {
  try {
    const response = await api.post("auth/login", loginFormData);
    Cookie.set("auth_token", response.data.auth_token);
    return {
      success: true,
      message: "Пользователь авторизовался",
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response && error.response.status === 401) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
    }
  }
};
