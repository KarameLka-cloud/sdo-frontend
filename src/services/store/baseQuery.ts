import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";
import { COOKIE_NAMES } from "@constants/api.ts";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_LOCATION,
  prepareHeaders: (headers) => {
    const token = Cookie.get(COOKIE_NAMES.AUTH_TOKEN);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
