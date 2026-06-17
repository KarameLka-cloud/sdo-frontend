import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@constants/api.ts";
import { baseQuery } from "../baseQuery.ts";

export const education = createApi({
  reducerPath: "education",
  tagTypes: ["Courses", "Events", "Webinars", "Tests"],
  baseQuery,
  endpoints: (builder) => ({
    getEducationCourses: builder.query({
      query: () => API_ENDPOINTS.EDUCATION_COURSES,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Courses" as const,
                id,
              })),
              "Courses",
            ]
          : ["Courses"],
    }),
    getEducationCourseById: builder.query({
      query: (id: number) => API_ENDPOINTS.EDUCATION_COURSES + id,
      providesTags: (_result, _error, id) => [{ type: "Courses", id }],
    }),
    addEducationCourse: builder.mutation({
      query: (course) => ({
        url: API_ENDPOINTS.EDUCATION_COURSES,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateEducationCourse: builder.mutation({
      query: ({ id, ...course }) => ({
        url: API_ENDPOINTS.EDUCATION_COURSES + id,
        method: "PATCH",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteEducationCourse: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.EDUCATION_COURSES + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getEducationEvents: builder.query({
      query: () => API_ENDPOINTS.EDUCATION_EVENTS,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Events" as const,
                id,
              })),
              "Events",
            ]
          : ["Events"],
    }),
    getEducationEventById: builder.query({
      query: (id: number) => API_ENDPOINTS.EDUCATION_EVENTS + id,
      providesTags: (_result, _error, id) => [{ type: "Events", id }],
    }),
    addEducationEvent: builder.mutation({
      query: (event) => ({
        url: API_ENDPOINTS.EDUCATION_EVENTS,
        method: "POST",
        body: event,
      }),
      invalidatesTags: ["Events"],
    }),
    updateEducationEvent: builder.mutation({
      query: ({ id, ...event }) => ({
        url: API_ENDPOINTS.EDUCATION_EVENTS + id,
        method: "PATCH",
        body: event,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEducationEvent: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.EDUCATION_EVENTS + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),

    getEducationWebinars: builder.query({
      query: () => API_ENDPOINTS.EDUCATION_WEBINARS,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Webinars" as const,
                id,
              })),
              "Webinars",
            ]
          : ["Webinars"],
    }),
    getEducationWebinarById: builder.query({
      query: (id: number) => API_ENDPOINTS.EDUCATION_WEBINARS + id,
      providesTags: (_result, _error, id) => [{ type: "Webinars", id }],
    }),
    addEducationWebinar: builder.mutation({
      query: (webinar) => ({
        url: API_ENDPOINTS.EDUCATION_WEBINARS,
        method: "POST",
        body: webinar,
      }),
      invalidatesTags: ["Webinars"],
    }),
    updateEducationWebinar: builder.mutation({
      query: ({ id, ...webinar }) => ({
        url: API_ENDPOINTS.EDUCATION_WEBINARS + id,
        method: "PATCH",
        body: webinar,
      }),
      invalidatesTags: ["Webinars"],
    }),
    deleteEducationWebinar: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.EDUCATION_WEBINARS + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Webinars"],
    }),

    getEducationTests: builder.query({
      query: () => API_ENDPOINTS.EDUCATION_TESTS,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Tests" as const,
                id,
              })),
              "Tests",
            ]
          : ["Tests"],
    }),
    getEducationTestById: builder.query({
      query: (id: number) => API_ENDPOINTS.EDUCATION_TESTS + id,
      providesTags: (_result, _error, id) => [{ type: "Tests", id }],
    }),
    addEducationTest: builder.mutation({
      query: (test) => ({
        url: API_ENDPOINTS.EDUCATION_TESTS,
        method: "POST",
        body: test,
      }),
      invalidatesTags: ["Tests"],
    }),
    updateEducationTest: builder.mutation({
      query: ({ id, ...test }) => ({
        url: API_ENDPOINTS.EDUCATION_TESTS + id,
        method: "PATCH",
        body: test,
      }),
      invalidatesTags: ["Tests"],
    }),
    deleteEducationTest: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.EDUCATION_TESTS + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Tests"],
    }),
  }),
});

export const {
  useGetEducationCoursesQuery,
  useGetEducationCourseByIdQuery,
  useAddEducationCourseMutation,
  useUpdateEducationCourseMutation,
  useDeleteEducationCourseMutation,
  useGetEducationEventsQuery,
  useGetEducationEventByIdQuery,
  useAddEducationEventMutation,
  useUpdateEducationEventMutation,
  useDeleteEducationEventMutation,
  useGetEducationWebinarsQuery,
  useGetEducationWebinarByIdQuery,
  useAddEducationWebinarMutation,
  useUpdateEducationWebinarMutation,
  useDeleteEducationWebinarMutation,
  useGetEducationTestsQuery,
  useGetEducationTestByIdQuery,
  useAddEducationTestMutation,
  useUpdateEducationTestMutation,
  useDeleteEducationTestMutation,
} = education;
