import Cookie from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/store/features/auth.ts";
import { baseApi } from "@/services/store/baseApi.ts";
import { ROUTES } from "@/constants/routes.ts";
import { COOKIE_NAMES } from "@/constants/api.ts";

interface ApiErrorResponse {
  data?: {
    message?: string;
  };
}

export const useLogin = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const loginUser = async (credentials: {
    login: string;
    password: string;
  }) => {
    setErrorMessage("");

    try {
      const response = await login(credentials).unwrap();
      Cookie.set(COOKIE_NAMES.AUTH_TOKEN, response.auth_token);
      // A previous session may still be cached, e.g. when a token expired and
      // another account signs in without an explicit logout.
      dispatch(baseApi.util.resetApiState());
      navigate(ROUTES.ROOT);
    } catch (error: unknown) {
      const message =
        (error as ApiErrorResponse).data?.message ?? "Ошибка авторизации";
      setErrorMessage(message);
    }
  };
  return { loginUser, errorMessage, isLoading };
};
