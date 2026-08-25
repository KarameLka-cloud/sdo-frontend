import { useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm.ts";

interface DeleteMessages {
  confirm: string;
  success: string;
  error: string;
}

type DeleteMutation = readonly [
  (id: number) => { unwrap: () => Promise<unknown> },
  { isLoading: boolean },
];

interface UseConfirmDeleteOptions {
  messages: DeleteMessages;
  onSuccess?: () => void;
  trackId?: boolean;
}

export function useConfirmDelete(
  deleteMutation: DeleteMutation,
  { messages, onSuccess, trackId = true }: UseConfirmDeleteOptions,
) {
  const [deleteItem, { isLoading: isDeleting }] = deleteMutation;
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const confirm = useConfirm();

  const handleDelete = async (idOrItem: number | { id: number }) => {
    const id = typeof idOrItem === "number" ? idOrItem : idOrItem.id;
    const confirmed = await confirm({ title: messages.confirm });
    if (!confirmed) return;

    if (trackId) setDeletingId(id);
    try {
      await deleteItem(id).unwrap();
      toast.success(messages.success);
      onSuccess?.();
    } catch {
      toast.error(messages.error);
    } finally {
      if (trackId) setDeletingId(null);
    }
  };

  const isDeletingItem = (id: number) => isDeleting && deletingId === id;

  return { handleDelete, isDeleting, isDeletingItem };
}
