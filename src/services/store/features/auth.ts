import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const auth = createApi({
    reducerPath: "auth",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_LOCATION,
        prepareHeaders: (headers) => {
            const token = Cookie.get("auth_token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "api/auth/login",
                method: "POST",
                body: credentials
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "api/auth/logout",
                method: "POST",
            }),
        })
    })
});

export const {useLoginMutation, useLogoutMutation} = auth;
