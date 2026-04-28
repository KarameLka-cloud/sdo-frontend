import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";
import { API_ENDPOINTS, COOKIE_NAMES } from "@constants/api.ts";

export const user = createApi({
  reducerPath: "user",
  tagTypes: ["Users", "AdaptationPlans"],
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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Users" as const,
                id,
              })),
              "Users",
            ]
          : ["Users"],
    }),
    getMentors: builder.query({
      query: (): string => API_ENDPOINTS.MENTORS,
    }),
    getDepartmentHeads: builder.query({
      query: (): string => API_ENDPOINTS.DEPARTMENT_HEADS,
    }),
    // assignAdminRole: builder.mutation({
    //   query: (credentials) => ({
    //     url: API_ENDPOINTS.ASSIGN_ADMIN_ROLE,
    //     method: "POST",
    //     body: credentials,
    //   }),
    //   invalidatesTags: ["Users"],
    // }),
    // revokeAdminRole: builder.mutation({
    //   query: (credentials) => ({
    //     url: API_ENDPOINTS.REVOKE_ADMIN_ROLE,
    //     method: "POST",
    //     body: credentials,
    //   }),
    //   invalidatesTags: ["Users"],
    // }),
    getRoles: builder.query({
      query: () => API_ENDPOINTS.ROLES,
    }),
    assignRole: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.ASSIGN_ROLE,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
    }),
    revokeRole: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.REVOKE_ROLE,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
    }),
    getDepartments: builder.query({
      query: () => API_ENDPOINTS.DEPARTMENTS,
    }),
    getPositions: builder.query({
      query: () => API_ENDPOINTS.POSITIONS,
    }),
    getAdaptationPlans: builder.query({
      query: (): string => API_ENDPOINTS.ADAPTATION_PLANS,
      providesTags: ["AdaptationPlans"],
    }),
    getAllAdaptationPlans: builder.query({
      query: (): string => API_ENDPOINTS.ADAPTATION_ALL_PLANS,
      providesTags: ["AdaptationPlans"],
    }),
    getMyAdaptationPlan: builder.query({
      query: (): string => API_ENDPOINTS.ADAPTATION_MY_PLAN,
      providesTags: ["AdaptationPlans"],
    }),
    createAdaptationPlan: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.ADAPTATION_PLANS,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
    updateAdaptationPlan: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
    deleteAdaptationPlan: builder.mutation({
      query: (id: number) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
  }),
});

export const {
  useGetUserByDataQuery,
  useGetUsersQuery,
  useGetMentorsQuery,
  useGetDepartmentHeadsQuery,
  // useAssignAdminRoleMutation,
  // useRevokeAdminRoleMutation,
  useGetRolesQuery,
  useAssignRoleMutation,
  useRevokeRoleMutation,
  useGetDepartmentsQuery,
  useGetPositionsQuery,
  useGetAdaptationPlansQuery,
  useGetAllAdaptationPlansQuery,
  useGetMyAdaptationPlanQuery,
  useCreateAdaptationPlanMutation,
  useUpdateAdaptationPlanMutation,
  useDeleteAdaptationPlanMutation,
} = user;
