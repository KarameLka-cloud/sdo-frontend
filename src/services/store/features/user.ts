import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@constants/api.ts";
import { baseQuery } from "../baseQuery.ts";
import type { AdaptationPlanType } from "@/interfaces/api/AdaptationPlanType.ts";
import type {
  AdaptationPlanTemplateTask,
  AdaptationPlanTemplateType,
} from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import type { UserType } from "@/interfaces/api/UserType.ts";
import type { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import type { PositionType } from "@/interfaces/api/PositionType.ts";

export type RoleOption = {
  name: string;
  label: string;
};

type RolesResponse = {
  success: boolean;
  data: RoleOption[];
};

type AssignRoleBody = {
  user_id: number;
  role: string;
};

type AdaptationPlanDayUpdateBody = {
  planId: number;
  dayId: number;
  date_from: string;
  date_to?: string | null;
  completion: string;
  employee_comment?: string | null;
  intern_comment?: string | null;
  mentor_comment?: string | null;
  department_head_comment?: string | null;
};

type AdaptationPlanTaskStatusBody = {
  planId: number;
  dayId: number;
  taskId: number;
  status: string;
};

type MyInternCommentBody = {
  dayId: number;
  intern_comment?: string | null;
};

type MyTaskStatusBody = {
  dayId: number;
  taskId: number;
  status: string;
};

type AdaptationPlanTemplateBody = {
  name: string;
  work_schedule: string;
  shifts: number[];
  task_blueprint?: AdaptationPlanTemplateTask[];
};

export const user = createApi({
  reducerPath: "user",
  tagTypes: ["Users", "AdaptationPlans", "AdaptationPlanTemplates"],
  baseQuery,
  endpoints: (builder) => ({
    // —— users / roles ——
    getUserByData: builder.query<UserType, void>({
      query: () => API_ENDPOINTS.ME,
    }),
    getUsers: builder.query<UserType[], void>({
      query: () => API_ENDPOINTS.USERS,
      providesTags: (result) =>
        result
          ? [
              ...result
                .filter((item): item is UserType & { id: number } => item.id != null)
                .map(({ id }) => ({ type: "Users" as const, id })),
              "Users",
            ]
          : ["Users"],
    }),
    getMentors: builder.query<UserType[], void>({
      query: () => API_ENDPOINTS.MENTORS,
    }),
    getDepartmentHeads: builder.query<UserType[], void>({
      query: () => API_ENDPOINTS.DEPARTMENT_HEADS,
    }),
    getRoles: builder.query<RolesResponse, void>({
      query: () => API_ENDPOINTS.ROLES,
    }),
    assignRole: builder.mutation<{ message?: string }, AssignRoleBody>({
      query: (body) => ({
        url: API_ENDPOINTS.ASSIGN_ROLE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    revokeRole: builder.mutation<{ message?: string }, AssignRoleBody>({
      query: (body) => ({
        url: API_ENDPOINTS.REVOKE_ROLE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // —— org ——
    getDepartments: builder.query<DepartmentType[], void>({
      query: () => API_ENDPOINTS.DEPARTMENTS,
    }),
    getPositions: builder.query<PositionType[], void>({
      query: () => API_ENDPOINTS.POSITIONS,
    }),

    // —— adaptation plans ——
    getAdaptationPlans: builder.query<AdaptationPlanType[], void>({
      query: () => API_ENDPOINTS.ADAPTATION_PLANS,
      providesTags: ["AdaptationPlans"],
    }),
    getAdaptationPlanById: builder.query<AdaptationPlanType, number>({
      query: (id) => `${API_ENDPOINTS.ADAPTATION_PLANS}${id}`,
      providesTags: (_result, _error, id) => [
        { type: "AdaptationPlans", id },
        "AdaptationPlans",
      ],
    }),
    getMyAdaptationPlan: builder.query<AdaptationPlanType | null, void>({
      query: () => API_ENDPOINTS.ADAPTATION_MY_PLAN,
      providesTags: ["AdaptationPlans"],
    }),
    createAdaptationPlan: builder.mutation<
      AdaptationPlanType,
      Record<string, unknown>
    >({
      query: (body) => ({
        url: API_ENDPOINTS.ADAPTATION_PLANS,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
    updateAdaptationPlan: builder.mutation<
      AdaptationPlanType,
      { id: number } & Record<string, unknown>
    >({
      query: ({ id, ...body }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
    deleteAdaptationPlan: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
    updateAdaptationPlanDay: builder.mutation<
      unknown,
      AdaptationPlanDayUpdateBody
    >({
      query: ({ planId, dayId, ...body }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${planId}/days/${dayId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
    updateAdaptationPlanTaskStatus: builder.mutation<
      unknown,
      AdaptationPlanTaskStatusBody
    >({
      query: ({ planId, dayId, taskId, status }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${planId}/days/${dayId}/tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
    updateMyAdaptationInternComment: builder.mutation<
      unknown,
      MyInternCommentBody
    >({
      query: ({ dayId, intern_comment }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_MY_PLAN_DAYS}${dayId}/intern-comment`,
        method: "PATCH",
        body: { intern_comment },
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),
    updateMyAdaptationTaskStatus: builder.mutation<unknown, MyTaskStatusBody>({
      query: ({ dayId, taskId, status }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_MY_PLAN_DAYS}${dayId}/tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdaptationPlans"],
    }),

    // —— adaptation templates ——
    getAdaptationPlanTemplates: builder.query<
      AdaptationPlanTemplateType[],
      void
    >({
      query: () => API_ENDPOINTS.ADAPTATION_PLAN_TEMPLATES,
      providesTags: ["AdaptationPlanTemplates"],
    }),
    getAdaptationPlanTemplateById: builder.query<
      AdaptationPlanTemplateType,
      number
    >({
      query: (id) => `${API_ENDPOINTS.ADAPTATION_PLAN_TEMPLATES}${id}`,
      providesTags: (_result, _error, id) => [
        { type: "AdaptationPlanTemplates", id },
        "AdaptationPlanTemplates",
      ],
    }),
    createAdaptationPlanTemplate: builder.mutation<
      AdaptationPlanTemplateType,
      AdaptationPlanTemplateBody
    >({
      query: (body) => ({
        url: API_ENDPOINTS.ADAPTATION_PLAN_TEMPLATES,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdaptationPlanTemplates"],
    }),
    updateAdaptationPlanTemplate: builder.mutation<
      AdaptationPlanTemplateType,
      { id: number } & AdaptationPlanTemplateBody
    >({
      query: ({ id, ...body }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLAN_TEMPLATES}${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdaptationPlanTemplates"],
    }),
    deleteAdaptationPlanTemplate: builder.mutation<{ message: string }, number>(
      {
        query: (id) => ({
          url: `${API_ENDPOINTS.ADAPTATION_PLAN_TEMPLATES}${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["AdaptationPlanTemplates"],
      },
    ),
  }),
});

export const {
  useGetUserByDataQuery,
  useGetUsersQuery,
  useGetMentorsQuery,
  useGetDepartmentHeadsQuery,
  useGetRolesQuery,
  useAssignRoleMutation,
  useRevokeRoleMutation,
  useGetDepartmentsQuery,
  useGetPositionsQuery,
  useGetAdaptationPlansQuery,
  useGetAdaptationPlanByIdQuery,
  useGetMyAdaptationPlanQuery,
  useCreateAdaptationPlanMutation,
  useUpdateAdaptationPlanMutation,
  useDeleteAdaptationPlanMutation,
  useUpdateAdaptationPlanDayMutation,
  useUpdateAdaptationPlanTaskStatusMutation,
  useUpdateMyAdaptationInternCommentMutation,
  useUpdateMyAdaptationTaskStatusMutation,
  useGetAdaptationPlanTemplatesQuery,
  useGetAdaptationPlanTemplateByIdQuery,
  useCreateAdaptationPlanTemplateMutation,
  useUpdateAdaptationPlanTemplateMutation,
  useDeleteAdaptationPlanTemplateMutation,
} = user;
