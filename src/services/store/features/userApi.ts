import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const userApi = createApi({
    reducerPath: "userApi",
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
            query: (name) => `api/users/${name}`,
        }),
        getUsers: builder.query({
            query: (): string => `api/users`
        })
    }),
});

export const {useGetUserByDataQuery, useGetUsersQuery} = userApi;
