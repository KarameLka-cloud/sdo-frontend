import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const login = createApi({
    reducerPath: "login",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_LOCATION,
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "api/auth/login",
                method: "POST",
                body: credentials
            })
        })
    })
});

export const logout = createApi({
    reducerPath: "logout",
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
        logout: builder.mutation({
            query: () => ({
                url: "api/auth/logout",
                method: "POST",
            }),
        })
    })
});

export const {useLoginMutation} = login;
export const {useLogoutMutation} = logout;
