import { JSX } from "react";

export type FormActionStatusType = "idle" | "loading" | "success" | "error";

export interface FormActionStatusProps {
  type: FormActionStatusType;
  message: string;
  className?: string;
}

function FormActionStatus({
  type,
  message,
  className,
}: FormActionStatusProps): JSX.Element | null {
  if (type === "idle" || !message.trim()) {
    return null;
  }

  const variantClass = (() => {
    switch (type) {
      case "error":
        return "text-red-700 bg-red-50 border-red-200";
      case "success":
        return "text-green-700 bg-green-50 border-green-200";
      case "loading":
        return "text-blue-700 bg-blue-50 border-blue-200";
      default:
        return "";
    }
  })();

  return (
    <span
      className={[
        "text-sm font-medium py-1.5 px-2.5 rounded-lg inline-block max-w-[min(100%,22rem)] leading-tight",
        variantClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {message}
    </span>
  );
}

export default FormActionStatus;
