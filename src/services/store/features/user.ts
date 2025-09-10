import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";
import {API_ENDPOINTS, COOKIE_NAMES} from "../../../constants/api.ts";

export const user = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_LOCATION,
        prepareHeaders: (headers) => {
            const token = Cookie.get(COOKIE_NAMES.AUTH_TOKEN);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUserByData: builder.query({
            query: () => API_ENDPOINTS.ME,
        }),
        getUsers: builder.query({
            query: (): string => API_ENDPOINTS.USERS,
        })
    }),
});

export const {useGetUserByDataQuery, useGetUsersQuery} = user;
