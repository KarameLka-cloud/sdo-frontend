import { Button } from "@/components/ui/shadcn/button";
import { CardFooter } from "@/components/ui/shadcn/card";
import { Spinner } from "@/components/ui/shadcn/spinner";

interface AdminEditFormFooterProps {
  isSaving: boolean;
  isDeleting: boolean;
  onDelete: () => void;
}

function AdminEditFormFooter({
  isSaving,
  isDeleting,
  onDelete,
}: AdminEditFormFooterProps) {
  const isBusy = isSaving || isDeleting;

  return (
    <CardFooter className="justify-between">
      <Button type="submit" disabled={isBusy}>
        {isSaving && <Spinner />}
        Сохранить
      </Button>
      <Button
        type="button"
        variant="destructive"
        disabled={isBusy}
        onClick={onDelete}
      >
        {isDeleting && <Spinner />}
        Удалить
      </Button>
    </CardFooter>
  );
}

export default AdminEditFormFooter;
