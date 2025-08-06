import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const user = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_LOCATION,
        prepareHeaders: (headers) => {
            const token = Cookie.get("auth_token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUserByData: builder.query({
            query: () => `api/users/me`,
        }),
        getUsers: builder.query({
            query: (): string => `api/users`
        })
    }),
});

export const {useGetUserByDataQuery, useGetUsersQuery} = user;
