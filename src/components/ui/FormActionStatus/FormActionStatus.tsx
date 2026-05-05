import { JSX } from "react";
import styles from "./FormActionStatus.module.css";

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

  const variantClass =
    type === "error" ? styles.error : type === "success" ? styles.success : styles.loading;

  return (
    <span className={[styles.root, variantClass, className].filter(Boolean).join(" ")}>
      {message}
    </span>
  );
}

export default FormActionStatus;
