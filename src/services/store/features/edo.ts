import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";
import {API_ENDPOINTS, COOKIE_NAMES} from "../../../constants/api.ts";

export const edo = createApi({
    reducerPath: "edo",
    tagTypes: ['Courses', 'Events', 'Tests'],
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
        // Edo courses
        getEdoCourses: builder.query({
            query: () => API_ENDPOINTS.EDO_COURSES,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Courses' as const, id})), 'Courses']
                    : ['Courses'],
        }),
        addEdoCourse: builder.mutation({
            query: (course) => ({
                url: API_ENDPOINTS.EDO_COURSES,
                method: "POST",
                body: course,
            }),
            invalidatesTags: ['Courses'],
        }),
        updateEdoCourse: builder.mutation({
            query: ({id, ...course}) => ({
                url: API_ENDPOINTS.EDO_COURSES + id,
                method: "PATCH",
                body: course,
            }),
            invalidatesTags: ['Courses'],
        }),
        deleteEdoCourse: builder.mutation({
            query: (id) => ({
                url: API_ENDPOINTS.EDO_COURSES + id,
                method: "DELETE",
            }),
            invalidatesTags: ['Courses'],
        }),

        // Edo events
        getEdoEvents: builder.query({
            query: () => API_ENDPOINTS.EDO_EVENTS,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Events' as const, id})), 'Events']
                    : ['Events'],
        }),
        addEdoEvent: builder.mutation({
            query: (event) => ({
                url: API_ENDPOINTS.EDO_EVENTS,
                method: "POST",
                body: event,
            }),
            invalidatesTags: ['Events'],
        }),
        updateEdoEvent: builder.mutation({
            query: ({id, ...event}) => ({
                url: API_ENDPOINTS.EDO_EVENTS + id,
                method: "PATCH",
                body: event,
            }),
            invalidatesTags: ['Events'],
        }),
        deleteEdoEvent: builder.mutation({
            query: (id) => ({
                url: API_ENDPOINTS.EDO_EVENTS + id,
                method: "DELETE",
            }),
            invalidatesTags: ['Events'],
        }),

        // Edo tests
        getEdoTests: builder.query({
            query: () => API_ENDPOINTS.EDO_TESTS,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Tests' as const, id})), 'Tests']
                    : ['Tests'],
        }),
        addEdoTest: builder.mutation({
            query: (test) => ({
                url: API_ENDPOINTS.EDO_TESTS,
                method: "POST",
                body: test
            }),
            invalidatesTags: ['Tests'],
        }),
        updateEdoTest: builder.mutation({
            query: ({id, ...test}) => ({
                url: API_ENDPOINTS.EDO_TESTS + id,
                method: "PATCH",
                body: test,
            }),
            invalidatesTags: ['Tests'],
        }),
        deleteEdoTest: builder.mutation({
            query: (id) => ({
                url: API_ENDPOINTS.EDO_TESTS + id,
                method: "DELETE",
            }),
            invalidatesTags: ['Tests'],
        })
    }),
});

export const {
    useGetEdoCoursesQuery,
    useAddEdoCourseMutation,
    useUpdateEdoCourseMutation,
    useDeleteEdoCourseMutation,
    useGetEdoEventsQuery,
    useAddEdoEventMutation,
    useUpdateEdoEventMutation,
    useDeleteEdoEventMutation,
    useGetEdoTestsQuery,
    useAddEdoTestMutation,
    useUpdateEdoTestMutation,
    useDeleteEdoTestMutation,
} = edo;
