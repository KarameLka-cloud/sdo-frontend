import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm.ts";

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
  const confirm = useConfirm();

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({ title: messages.confirm });
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
