import { useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm.ts";

interface DeleteMessages {
  confirm: string;
  success: string;
  error: string;
}

export function useAdminListDelete<T extends { id: number }>(
  deleteMutation: readonly [
    (id: number) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ],
  messages: DeleteMessages,
) {
  const [deleteItem, { isLoading: isDeleting }] = deleteMutation;
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const confirm = useConfirm();

  const handleDelete = async (item: T) => {
    const confirmed = await confirm({ title: messages.confirm });
    if (!confirmed) return;

    setDeletingId(item.id);
    try {
      await deleteItem(item.id).unwrap();
      toast.success(messages.success);
    } catch {
      toast.error(messages.error);
    } finally {
      setDeletingId(null);
    }
  };

  const isDeletingItem = (id: number) => isDeleting && deletingId === id;

  return { handleDelete, isDeletingItem };
}
