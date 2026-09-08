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
        providesTags: (result, _error, { category, type }) =>
          result
            ? [
                ...result.map(({ id }) => ({
                  type: "LearningItems" as const,
                  id,
                })),
                { type: "LearningItems" as const, id: `${category}:${type}` },
              ]
            : [{ type: "LearningItems" as const, id: `${category}:${type}` }],
      },
    ),
    addLearningItem: builder.mutation<
      LearningItemType,
      Omit<LearningItemType, "id" | "department" | "position">
    >({
      query: (item) => ({
        url: API_ENDPOINTS.LEARNING_ITEMS,
        method: "POST",
        body: item,
      }),
      invalidatesTags: (_result, _error, item) => [
        { type: "LearningItems", id: `${item.category}:${item.type}` },
      ],
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
      invalidatesTags: (_result, _error, item) => [
        { type: "LearningItems", id: item.id },
        ...(item.category && item.type
          ? [{ type: "LearningItems" as const, id: `${item.category}:${item.type}` }]
          : []),
      ],
    }),
    deleteLearningItem: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.LEARNING_ITEMS}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "LearningItems", id },
      ],
    }),
  }),
});

export const {
  useGetLearningItemsQuery,
  useAddLearningItemMutation,
  useUpdateLearningItemMutation,
  useDeleteLearningItemMutation,
} = learningItemsApi;
