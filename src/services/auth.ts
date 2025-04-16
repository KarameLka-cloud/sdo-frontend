import api from "./api.ts";
import Cookie from "js-cookie";
import { AxiosError } from "axios";

export const login = async (loginFormData: object) => {
  try {
    const response = await api.post("/api/auth/login", loginFormData);
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

export const logout = async () => {
  try {
    await api.post("/api/auth/logout");
    Cookie.remove("auth_token");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      if (error.response && error.response.status === 401) {
        return { success: false };
      }
    }
  }
};
