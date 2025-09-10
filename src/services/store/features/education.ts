import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";
import {API_ENDPOINTS, COOKIE_NAMES} from "@constants/api.ts";

export const education = createApi({
    reducerPath: "education",
    tagTypes: ['Courses', 'Events', 'Webinars', 'Tests'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_LOCATION,
        prepareHeaders: (headers) => {
            const token = Cookie.get(COOKIE_NAMES.AUTH_TOKEN);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        // Education courses
        getEducationCourses: builder.query({
            query: () => API_ENDPOINTS.EDUCATION_COURSES,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Courses' as const, id})), 'Courses']
                    : ['Courses'],
        }),
        addEducationCourse: builder.mutation({
            query: (course) => ({
                url: API_ENDPOINTS.EDUCATION_COURSES,
                method: "POST",
                body: course,
            }),
            invalidatesTags: ['Courses'],
        }),
        updateEducationCourse: builder.mutation({
            query: ({id, ...course}) => ({
                url: API_ENDPOINTS.EDUCATION_COURSES + id,
                method: "PATCH",
                body: course,
            }),
            invalidatesTags: ['Courses']
        }),
        deleteEducationCourse: builder.mutation({
            query: (id) => ({
                url: API_ENDPOINTS.EDUCATION_COURSES + id,
                method: "DELETE",
            }),
            invalidatesTags: ['Courses'],
        }),

        // Education events
        getEducationEvents: builder.query({
            query: () => API_ENDPOINTS.EDUCATION_EVENTS,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Events' as const, id})), 'Events']
                    : ['Events'],
        }),
        addEducationEvent: builder.mutation({
            query: (event) => ({
                url: API_ENDPOINTS.EDUCATION_EVENTS,
                method: "POST",
                body: event,
            }),
            invalidatesTags: ['Events'],
        }),
        updateEducationEvent: builder.mutation({
            query: ({id, ...event}) => ({
                url: API_ENDPOINTS.EDUCATION_EVENTS + id,
                method: "PATCH",
                body: event,
            }),
            invalidatesTags: ['Events']
        }),
        deleteEducationEvent: builder.mutation({
            query: (id) => ({
                url: API_ENDPOINTS.EDUCATION_EVENTS + id,
                method: "DELETE",
            }),
            invalidatesTags: ['Events'],
        }),

        // Education webinars
        getEducationWebinars: builder.query({
            query: () => API_ENDPOINTS.EDUCATION_WEBINARS,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Webinars' as const, id})), 'Webinars']
                    : ['Webinars'],
        }),
        addEducationWebinar: builder.mutation({
            query: (webinar) => ({
                url: API_ENDPOINTS.EDUCATION_WEBINARS,
                method: "POST",
                body: webinar,
            }),
            invalidatesTags: ['Webinars'],
        }),
        updateEducationWebinar: builder.mutation({
            query: ({id, ...webinar}) => ({
                url: API_ENDPOINTS.EDUCATION_WEBINARS + id,
                method: "PATCH",
                body: webinar,
            }),
            invalidatesTags: ['Webinars']
        }),
        deleteEducationWebinar: builder.mutation({
            query: (id) => ({
                url: API_ENDPOINTS.EDUCATION_WEBINARS + id,
                method: "DELETE",
            }),
            invalidatesTags: ['Webinars'],
        }),

        // Education tests
        getEducationTests: builder.query({
            query: () => API_ENDPOINTS.EDUCATION_TESTS,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Tests' as const, id})), 'Tests']
                    : ['Tests'],
        }),
        addEducationTest: builder.mutation({
            query: (test) => ({
                url: API_ENDPOINTS.EDUCATION_TESTS,
                method: "POST",
                body: test
            }),
            invalidatesTags: ['Tests'],
        }),
        updateEducationTest: builder.mutation({
            query: ({id, ...test}) => ({
                url: API_ENDPOINTS.EDUCATION_TESTS + id,
                method: "PATCH",
                body: test,
            }),
            invalidatesTags: ['Tests'],
        }),
        deleteEducationTest: builder.mutation({
            query: (id) => ({
                url: API_ENDPOINTS.EDUCATION_TESTS + id,
                method: "DELETE",
            }),
            invalidatesTags: ['Tests'],
        })
    }),
});

export const {
    useGetEducationCoursesQuery,
    useAddEducationCourseMutation,
    useUpdateEducationCourseMutation,
    useDeleteEducationCourseMutation,
    useGetEducationEventsQuery,
    useAddEducationEventMutation,
    useUpdateEducationEventMutation,
    useDeleteEducationEventMutation,
    useGetEducationWebinarsQuery,
    useAddEducationWebinarMutation,
    useUpdateEducationWebinarMutation,
    useDeleteEducationWebinarMutation,
    useGetEducationTestsQuery,
    useAddEducationTestMutation,
    useUpdateEducationTestMutation,
    useDeleteEducationTestMutation,
} = education;
