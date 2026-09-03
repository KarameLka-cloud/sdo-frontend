import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";
import { COOKIE_NAMES } from "@/constants/api.ts";
import { ROUTES } from "@/constants/routes.ts";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_LOCATION,
  prepareHeaders: (headers) => {
    const token = Cookie.get(COOKIE_NAMES.AUTH_TOKEN);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Wraps the HTTP query so an expired or revoked token ends the session once,
 * instead of leaving the UI retrying requests that can never succeed.
 */
export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const isUnauthorized = result.error?.status === 401;
  const hadToken = Boolean(Cookie.get(COOKIE_NAMES.AUTH_TOKEN));
  const onLoginPage = window.location.pathname === ROUTES.LOGIN;

  if (isUnauthorized && hadToken && !onLoginPage) {
    Cookie.remove(COOKIE_NAMES.AUTH_TOKEN);
    window.location.assign(ROUTES.LOGIN);
  }

  return result;
};
