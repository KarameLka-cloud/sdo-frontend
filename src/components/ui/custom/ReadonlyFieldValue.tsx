import { JSX } from "react";
import { cn } from "@/lib/utils";

interface ReadonlyFieldValueProps {
  value: string;
  emptyPlaceholder?: string;
  className?: string;
}

function ReadonlyFieldValue({
  value,
  emptyPlaceholder = "—",
  className,
}: ReadonlyFieldValueProps): JSX.Element {
  const trimmed = (value ?? "").trim();

  return (
    <p
      className={cn(
        "m-0 min-h-[1.35em] text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
        !trimmed && "text-muted-foreground",
        className,
      )}
    >
      {trimmed || emptyPlaceholder}
    </p>
  );
}

export default ReadonlyFieldValue;
