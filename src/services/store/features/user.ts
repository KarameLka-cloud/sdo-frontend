import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";
import {API_ENDPOINTS, COOKIE_NAMES} from "@constants/api.ts";

export const user = createApi({
    reducerPath: "user",
    tagTypes: ["Users"],
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
                    ? [...result.map(({id}: { id: number }) => ({type: 'Users' as const, id})), 'Users']
                    : ['Users'],
        }),
        assignAdminRole: builder.mutation({
            query: (credentials) => ({
                url: API_ENDPOINTS.ASSIGN_ADMIN_ROLE,
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ['Users'],
        }),
        revokeAdminRole: builder.mutation({
            query: (credentials) => ({
                url: API_ENDPOINTS.REVOKE_ADMIN_ROLE,
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ['Users'],
        }),
        getDepartments: builder.query({
            query: () => API_ENDPOINTS.DEPARTMENTS,
        }),
        getPositions: builder.query({
            query: () => API_ENDPOINTS.POSITIONS,
        }),
    }),
});

export const {
    useGetUsersQuery,
    useAssignAdminRoleMutation,
    useRevokeAdminRoleMutation,
    useGetDepartmentsQuery,
    useGetPositionsQuery
} = user;
