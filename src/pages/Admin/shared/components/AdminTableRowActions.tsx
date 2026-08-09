import { useNavigate } from "react-router-dom";
import { MoreHorizontalIcon, CopyIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";

interface AdminTableRowActionsProps {
  editPath: string;
  onDelete?: () => void;
  onCopy?: () => void;
  isDeleting: boolean;
  isCopying?: boolean;
  showDelete?: boolean;
}

function AdminTableRowActions({
  editPath,
  onDelete,
  onCopy,
  isDeleting,
  isCopying = false,
  showDelete = true,
}: AdminTableRowActionsProps) {
  const navigate = useNavigate();
  const isBusy = isDeleting || isCopying;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={isBusy}
        >
          <MoreHorizontalIcon />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-max">
        <DropdownMenuItem onClick={() => navigate(editPath)}>
          <PencilIcon />
          Редактировать
        </DropdownMenuItem>
        {onCopy && (
          <DropdownMenuItem onClick={onCopy} disabled={isCopying}>
            <CopyIcon />
            Создать копию
          </DropdownMenuItem>
        )}
        {showDelete && onDelete && (
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              onDelete();
            }}
          >
            <TrashIcon />
            Удалить
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminTableRowActions;
