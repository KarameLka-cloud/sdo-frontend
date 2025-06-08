import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const edoApi = createApi({
    reducerPath: "edoApi",
    tagTypes: ['Events'],
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
        getEdoEvents: builder.query({
            query: () => "api/edo/events",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: {id: number}) => ({type: 'Events' as const, id})), 'Events']
                    : ['Events'],
        }),
        addEdoEvent: builder.mutation({
            query: (event) => ({
                url: "api/edo/events",
                method: "POST",
                body: event,
            }),
            invalidatesTags: ['Events'],
        }),
    }),
});

export const {useGetEdoEventsQuery, useAddEdoEventMutation} = edoApi;
