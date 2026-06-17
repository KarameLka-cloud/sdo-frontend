import { ReactNode } from "react";
import { useDelete } from "@/hooks/useDelete.ts";
import IconButton from "./IconButton.tsx";

interface AdminResourceRowProps<T extends { id: number }> {
  className?: string;
  item: T;
  deleteMessage: string;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
  children: ReactNode;
}

function AdminResourceRow<T extends { id: number }>({
  className,
  item,
  deleteMessage,
  mutationDelete,
  children,
}: AdminResourceRowProps<T>) {
  const handleDelete = useDelete(mutationDelete, deleteMessage);

  return (
    <div
      className={`flex items-center p-4 rounded-2xl bg-white text-gray-900 font-semibold ${className || ""}`}
    >
      <div className="w-full mr-auto">{children}</div>
      <IconButton
        type="delete"
        onClick={() => handleDelete(item.id)}
        className="ml-2"
      />
    </div>
  );
}

export default AdminResourceRow;
