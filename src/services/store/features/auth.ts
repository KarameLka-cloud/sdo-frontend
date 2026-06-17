import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@constants/api.ts";
import { baseQuery } from "../baseQuery.ts";

export const auth = createApi({
  reducerPath: "auth",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH_LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_ENDPOINTS.AUTH_LOGOUT,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = auth;
