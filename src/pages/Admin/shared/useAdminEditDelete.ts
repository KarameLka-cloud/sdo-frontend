import { toast } from "sonner";

interface DeleteMessages {
  confirm: string;
  success: string;
  error: string;
}

export function useAdminEditDelete(
  deleteMutation: readonly [
    (id: number) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ],
  messages: DeleteMessages,
  onSuccess: () => void,
) {
  const [deleteItem, { isLoading: isDeleting }] = deleteMutation;

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(messages.confirm);
    if (!confirmed) return;

    try {
      await deleteItem(id).unwrap();
      toast.success(messages.success);
      onSuccess();
    } catch {
      toast.error(messages.error);
    }
  };

  return { handleDelete, isDeleting };
}
