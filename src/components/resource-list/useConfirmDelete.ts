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

/** Server-supplied reason, e.g. "template is still used by N plans". */
const errorMessageOf = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return undefined;
  }

  const data = (error as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message ? message : undefined;
};

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
    } catch (error) {
      toast.error(errorMessageOf(error) ?? messages.error);
    } finally {
      if (trackId) setDeletingId(null);
    }
  };

  const isDeletingItem = (id: number) => isDeleting && deletingId === id;

  return { handleDelete, isDeleting, isDeletingItem };
}
