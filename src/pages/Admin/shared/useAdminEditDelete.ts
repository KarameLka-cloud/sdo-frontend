import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";

/** @deprecated Use useConfirmDelete from @/components/resource-list/useConfirmDelete */
export function useAdminEditDelete(
  deleteMutation: readonly [
    (id: number) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ],
  messages: { confirm: string; success: string; error: string },
  onSuccess: () => void,
) {
  const { handleDelete, isDeleting } = useConfirmDelete(deleteMutation, {
    messages,
    onSuccess,
    trackId: false,
  });

  return {
    handleDelete: (id: number) => handleDelete(id),
    isDeleting,
  };
}
