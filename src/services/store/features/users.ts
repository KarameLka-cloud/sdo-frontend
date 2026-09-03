import { API_ENDPOINTS } from "@/constants/api.ts";
import { baseApi } from "../baseApi.ts";
import type { UserType } from "@/interfaces/api/UserType.ts";

export interface RoleOption {
  name: string;
  label: string;
}

interface RoleAssignmentBody {
  user_id: number;
  role: string;
}

const listTags = (result: UserType[] | undefined) =>
  result
    ? [
        ...result
          .filter((user): user is UserType & { id: number } => user.id != null)
          .map(({ id }) => ({ type: "Users" as const, id })),
        "Users" as const,
      ]
    : ["Users" as const];

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserType, void>({
      query: () => API_ENDPOINTS.ME,
      providesTags: ["CurrentUser"],
    }),
    getUsers: builder.query<UserType[], void>({
      query: () => API_ENDPOINTS.USERS,
      providesTags: listTags,
    }),
    getMentors: builder.query<UserType[], void>({
      query: () => API_ENDPOINTS.MENTORS,
      providesTags: listTags,
    }),
    getDepartmentHeads: builder.query<UserType[], void>({
      query: () => API_ENDPOINTS.DEPARTMENT_HEADS,
      providesTags: listTags,
    }),
    getRoles: builder.query<RoleOption[], void>({
      query: () => API_ENDPOINTS.ROLES,
      providesTags: ["Roles"],
    }),
    assignRole: builder.mutation<{ message?: string }, RoleAssignmentBody>({
      query: (body) => ({
        url: API_ENDPOINTS.ASSIGN_ROLE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users", "CurrentUser"],
    }),
    revokeRole: builder.mutation<{ message?: string }, RoleAssignmentBody>({
      query: (body) => ({
        url: API_ENDPOINTS.REVOKE_ROLE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users", "CurrentUser"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useGetMentorsQuery,
  useGetDepartmentHeadsQuery,
  useGetRolesQuery,
  useAssignRoleMutation,
  useRevokeRoleMutation,
} = usersApi;
