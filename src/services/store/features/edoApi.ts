import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const edoApi = createApi({
    reducerPath: "edoApi",
    tagTypes: ['Courses', 'Events', 'Tests'],
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
        // Edo courses
        getEdoCourses: builder.query({
            query: () => "api/edo/courses",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Courses' as const, id})), 'Courses']
                    : ['Courses'],
        }),
        addEdoCourse: builder.mutation({
            query: (course) => ({
                url: "api/edo/courses",
                method: "POST",
                body: course,
            }),
            invalidatesTags: ['Courses'],
        }),
        deleteEdoCourse: builder.mutation({
            query: (id) => ({
                url: `api/edo/courses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Courses'],
        }),

        // Edo events
        getEdoEvents: builder.query({
            query: () => "api/edo/events",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Events' as const, id})), 'Events']
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
        deleteEdoEvent: builder.mutation({
            query: (id) => ({
                url: `api/edo/events/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Events'],
        }),

        // Edo tests
    }),
});

export const {useGetEdoEventsQuery, useAddEdoEventMutation, useDeleteEdoEventMutation} = edoApi;
