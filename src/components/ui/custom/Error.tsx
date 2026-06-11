import { JSX } from "react";

interface ErrorType {
  children: string;
  className?: string;
}

function Error({ children, className }: ErrorType): JSX.Element {
  return <span className={`text-red-500 ${className ?? ""}`}>{children}</span>;
}

export default Error;
