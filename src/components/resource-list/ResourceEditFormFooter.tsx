import { Button } from "@/components/ui/shadcn/button";
import { CardFooter } from "@/components/ui/shadcn/card";
import { Spinner } from "@/components/ui/shadcn/spinner";

interface ResourceEditFormFooterProps {
  isSaving: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  canEdit?: boolean;
  showDelete?: boolean;
}

function ResourceEditFormFooter({
  isSaving,
  isDeleting,
  onDelete,
  canEdit = true,
  showDelete = true,
}: ResourceEditFormFooterProps) {
  const isBusy = isSaving || isDeleting;

  if (!canEdit && !showDelete) {
    return null;
  }

  return (
    <CardFooter className="justify-between">
      {canEdit ? (
        <Button type="submit" disabled={isBusy}>
          {isSaving && <Spinner />}
          Сохранить
        </Button>
      ) : (
        <span />
      )}
      {showDelete && (
        <Button
          type="button"
          variant="destructive"
          disabled={isBusy}
          onClick={onDelete}
        >
          {isDeleting && <Spinner />}
          Удалить
        </Button>
      )}
    </CardFooter>
  );
}

export default ResourceEditFormFooter;
