import { API_ENDPOINTS } from "@/constants/api.ts";
import { baseApi } from "../baseApi.ts";

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  auth_token: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH_LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ message?: string }, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH_LOGOUT,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
