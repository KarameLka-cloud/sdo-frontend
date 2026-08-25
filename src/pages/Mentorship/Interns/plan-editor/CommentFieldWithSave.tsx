import { JSX } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Field, FieldLabel } from "@/components/ui/shadcn/field";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { Textarea } from "@/components/ui/shadcn/textarea";

interface CommentFieldWithSaveProps {
  label: string;
  value: string;
  savedValue: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}

function CommentFieldWithSave({
  label,
  value,
  savedValue,
  isSaving,
  onChange,
  onSave,
}: CommentFieldWithSaveProps): JSX.Element {
  const hasChanges = value !== savedValue;

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button
        type="button"
        size="sm"
        className="w-fit"
        disabled={!hasChanges || isSaving}
        onClick={onSave}
      >
        {isSaving && <Spinner />}
        Сохранить
      </Button>
    </Field>
  );
}

export default CommentFieldWithSave;
