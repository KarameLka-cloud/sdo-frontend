import { API_ENDPOINTS } from "@/constants/api.ts";
import { baseApi } from "../baseApi.ts";
import type {
  AdaptationPlanDayType,
  AdaptationPlanTaskType,
  AdaptationPlanType,
} from "@/interfaces/api/AdaptationPlanType.ts";
import type {
  AdaptationPlanTemplateTask,
  AdaptationPlanTemplateType,
} from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import type { TaskStatus } from "@/interfaces/api/AdaptationPlanType.ts";

export interface AdaptationPlanBody {
  user_id: number;
  mentor: number;
  department_head: number;
  adaptation_plan_template_id: number;
  shift: number;
  start_date: string;
}

export interface AdaptationPlanDayBody {
  planId: number;
  dayId: number;
  date_from: string;
  date_to?: string | null;
  completion: string;
  employee_comment?: string | null;
  intern_comment?: string | null;
  mentor_comment?: string | null;
  department_head_comment?: string | null;
}

export interface AdaptationPlanTemplateBody {
  name: string;
  work_schedule: string;
  shifts: number[];
  task_blueprint?: AdaptationPlanTemplateTask[];
}

const PLAN_LIST_TAG = { type: "AdaptationPlans" as const, id: "LIST" };

/**
 * A mutation on one plan must refresh that plan and the roster, but it must
 * not touch other plans — the plan editor rebuilds its form from every
 * refetch, so a wider tag would discard the user's unsaved edits.
 */
const planTags = (id: number) => [
  { type: "AdaptationPlans" as const, id },
  PLAN_LIST_TAG,
];

export const adaptationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdaptationPlans: builder.query<AdaptationPlanType[], void>({
      query: () => API_ENDPOINTS.ADAPTATION_PLANS,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AdaptationPlans" as const,
                id,
              })),
              PLAN_LIST_TAG,
            ]
          : [PLAN_LIST_TAG],
    }),
    getAdaptationPlanById: builder.query<AdaptationPlanType, number>({
      query: (id) => `${API_ENDPOINTS.ADAPTATION_PLANS}${id}`,
      providesTags: (_result, _error, id) => [{ type: "AdaptationPlans", id }],
    }),
    getMyAdaptationPlan: builder.query<AdaptationPlanType | null, void>({
      query: () => API_ENDPOINTS.ADAPTATION_MY_PLAN,
      providesTags: ["MyAdaptationPlan"],
    }),
    createAdaptationPlan: builder.mutation<
      AdaptationPlanType,
      AdaptationPlanBody
    >({
      query: (body) => ({
        url: API_ENDPOINTS.ADAPTATION_PLANS,
        method: "POST",
        body,
      }),
      invalidatesTags: [PLAN_LIST_TAG],
    }),
    updateAdaptationPlan: builder.mutation<
      AdaptationPlanType,
      Partial<AdaptationPlanBody> & { id: number }
    >({
      query: ({ id, ...body }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => planTags(id),
    }),
    deleteAdaptationPlan: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => planTags(id),
    }),
    updateAdaptationPlanDay: builder.mutation<
      AdaptationPlanDayType,
      AdaptationPlanDayBody
    >({
      query: ({ planId, dayId, ...body }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${planId}/days/${dayId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { planId }) => planTags(planId),
    }),
    updateAdaptationPlanTaskStatus: builder.mutation<
      AdaptationPlanTaskType,
      { planId: number; dayId: number; taskId: number; status: TaskStatus }
    >({
      query: ({ planId, dayId, taskId, status }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLANS}${planId}/days/${dayId}/tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { planId }) => planTags(planId),
    }),
    updateMyAdaptationInternComment: builder.mutation<
      AdaptationPlanDayType,
      { dayId: number; intern_comment?: string | null }
    >({
      query: ({ dayId, intern_comment }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_MY_PLAN_DAYS}${dayId}/intern-comment`,
        method: "PATCH",
        body: { intern_comment },
      }),
      invalidatesTags: ["MyAdaptationPlan"],
    }),
    updateMyAdaptationTaskStatus: builder.mutation<
      AdaptationPlanTaskType,
      { dayId: number; taskId: number; status: TaskStatus }
    >({
      query: ({ dayId, taskId, status }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_MY_PLAN_DAYS}${dayId}/tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["MyAdaptationPlan"],
    }),

    getAdaptationPlanTemplates: builder.query<
      AdaptationPlanTemplateType[],
      void
    >({
      query: () => API_ENDPOINTS.ADAPTATION_PLAN_TEMPLATES,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AdaptationPlanTemplates" as const,
                id,
              })),
              "AdaptationPlanTemplates" as const,
            ]
          : ["AdaptationPlanTemplates"],
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
      AdaptationPlanTemplateBody & { id: number }
    >({
      query: ({ id, ...body }) => ({
        url: `${API_ENDPOINTS.ADAPTATION_PLAN_TEMPLATES}${id}`,
        method: "PUT",
        body,
      }),
      // Templates drive plan generation, so plans may change too.
      invalidatesTags: [
        "AdaptationPlanTemplates",
        PLAN_LIST_TAG,
        "MyAdaptationPlan",
      ],
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
} = adaptationApi;
