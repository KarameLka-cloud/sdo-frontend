import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const edoApi = createApi({
    reducerPath: "edoApi",
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
        getEventEdoByData: builder.query({
            query: () => `api/edo/events`,
        }),
        createEventEdo: builder.mutation({
            query: (newEvent) => ({
                url: "api/edo/events",
                method: "POST",
                body: newEvent,
            }),
        }),
    }),
});

export const {useGetEventEdoByDataQuery, useCreateEventEdoMutation} = edoApi;
