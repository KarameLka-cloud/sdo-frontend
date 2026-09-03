import { API_ENDPOINTS } from "@/constants/api.ts";
import { baseApi } from "../baseApi.ts";
import type {
  LearningCategory,
  LearningItemType,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";

interface LearningItemsQueryArgs {
  category: LearningCategory;
  type: LearningType;
}

export const learningItemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLearningItems: builder.query<LearningItemType[], LearningItemsQueryArgs>(
      {
        query: ({ category, type }) => ({
          url: API_ENDPOINTS.LEARNING_ITEMS,
          params: { category, type },
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({
                  type: "LearningItems" as const,
                  id,
                })),
                "LearningItems" as const,
              ]
            : ["LearningItems"],
      },
    ),
    getLearningItemById: builder.query<LearningItemType, number>({
      query: (id) => `${API_ENDPOINTS.LEARNING_ITEMS}${id}`,
      providesTags: (_result, _error, id) => [{ type: "LearningItems", id }],
    }),
    addLearningItem: builder.mutation<
      LearningItemType,
      Omit<LearningItemType, "id" | "department" | "position">
    >({
      query: (item) => ({
        url: API_ENDPOINTS.LEARNING_ITEMS,
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["LearningItems"],
    }),
    updateLearningItem: builder.mutation<
      LearningItemType,
      Partial<LearningItemType> & { id: number }
    >({
      query: ({ id, ...item }) => ({
        url: `${API_ENDPOINTS.LEARNING_ITEMS}${id}`,
        method: "PATCH",
        body: item,
      }),
      invalidatesTags: ["LearningItems"],
    }),
    deleteLearningItem: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.LEARNING_ITEMS}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LearningItems"],
    }),
  }),
});

export const {
  useGetLearningItemsQuery,
  useGetLearningItemByIdQuery,
  useAddLearningItemMutation,
  useUpdateLearningItemMutation,
  useDeleteLearningItemMutation,
} = learningItemsApi;
