import { JSX } from "react";
import { cn } from "@/lib/utils";

export type FormActionStatusType = "idle" | "loading" | "success" | "error";

interface FormActionStatusProps {
  type: FormActionStatusType;
  message: string;
  className?: string;
}

const VARIANT_CLASS: Record<Exclude<FormActionStatusType, "idle">, string> = {
  error: "text-red-700 bg-red-50 border-red-200",
  success: "text-green-700 bg-green-50 border-green-200",
  loading: "text-blue-700 bg-blue-50 border-blue-200",
};

function FormActionStatus({
  type,
  message,
  className,
}: FormActionStatusProps): JSX.Element | null {
  if (type === "idle" || !message.trim()) {
    return null;
  }

  return (
    <span
      className={cn(
        "text-sm font-medium py-1.5 px-2.5 rounded-lg inline-block max-w-[min(100%,22rem)] leading-tight border",
        VARIANT_CLASS[type],
        className,
      )}
    >
      {message}
    </span>
  );
}

export default FormActionStatus;
