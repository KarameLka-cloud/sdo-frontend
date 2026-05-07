import { JSX } from "react";
import styles from "./Error.module.css";

interface ErrorType {
  children: string;
  className?: string;
}

function Error({ children, className }: ErrorType): JSX.Element {
  return (
    <span className={`${styles.error} ${className ?? ""}`}>{children}</span>
  );
}

export default Error;
