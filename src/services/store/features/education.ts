import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const education = createApi({
    reducerPath: "education",
    tagTypes: ['Courses', 'Events', 'Webinars', 'Tests'],
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
        // Education courses
        getEducationCourses: builder.query({
            query: () => "api/education/courses",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Courses' as const, id})), 'Courses']
                    : ['Courses'],
        }),
        addEducationCourse: builder.mutation({
            query: (course) => ({
                url: "api/education/courses",
                method: "POST",
                body: course,
            }),
            invalidatesTags: ['Courses'],
        }),
        updateEducationCourse: builder.mutation({
            query: ({id, ...course}) => ({
                url: `api/education/courses/${id}`,
                method: "PATCH",
                body: course,
            }),
            invalidatesTags: ['Courses']
        }),
        deleteEducationCourse: builder.mutation({
            query: (id) => ({
                url: `api/education/courses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Courses'],
        }),

        // Education events
        getEducationEvents: builder.query({
            query: () => "api/education/events",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Events' as const, id})), 'Events']
                    : ['Events'],
        }),
        addEducationEvent: builder.mutation({
            query: (event) => ({
                url: "api/education/events",
                method: "POST",
                body: event,
            }),
            invalidatesTags: ['Events'],
        }),
        updateEducationEvent: builder.mutation({
            query: ({id, ...event}) => ({
                url: `api/education/events/${id}`,
                method: "PATCH",
                body: event,
            }),
            invalidatesTags: ['Events']
        }),
        deleteEducationEvent: builder.mutation({
            query: (id) => ({
                url: `api/education/events/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Events'],
        }),

        // Education webinars
        getEducationWebinars: builder.query({
            query: () => "api/education/webinars",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Webinars' as const, id})), 'Webinars']
                    : ['Webinars'],
        }),
        addEducationWebinar: builder.mutation({
            query: (webinar) => ({
                url: "api/education/webinars",
                method: "POST",
                body: webinar,
            }),
            invalidatesTags: ['Webinars'],
        }),
        updateEducationWebinar: builder.mutation({
            query: ({id, ...webinar}) => ({
                url: `api/education/webinars/${id}`,
                method: "PATCH",
                body: webinar,
            }),
            invalidatesTags: ['Webinars']
        }),
        deleteEducationWebinar: builder.mutation({
            query: (id) => ({
                url: `api/education/webinars/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Webinars'],
        }),

        // Education tests
        getEducationTests: builder.query({
            query: () => "api/education/tests",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}: { id: number }) => ({type: 'Tests' as const, id})), 'Tests']
                    : ['Tests'],
        }),
        addEducationTest: builder.mutation({
            query: (test) => ({
                url: "api/education/tests",
                method: "POST",
                body: test
            }),
            invalidatesTags: ['Tests'],
        }),
        updateEducationTest: builder.mutation({
            query: ({id, ...test}) => ({
                url: `api/education/tests/${id}`,
                method: "PATCH",
                body: test,
            }),
            invalidatesTags: ['Tests'],
        }),
        deleteEducationTest: builder.mutation({
            query: (id) => ({
                url: `api/education/tests/${id}`,
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
