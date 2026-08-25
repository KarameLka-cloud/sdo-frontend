import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";

/** @deprecated Use useConfirmDelete from @/components/resource-list/useConfirmDelete */
export function useAdminListDelete<T extends { id: number }>(
  deleteMutation: readonly [
    (id: number) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ],
  messages: { confirm: string; success: string; error: string },
) {
  return useConfirmDelete(deleteMutation, { messages, trackId: true });
}
