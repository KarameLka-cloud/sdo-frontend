import { JSX } from "react";
import style from "./InputError.module.css";

function InputError({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}): JSX.Element {
  return <p className={`${style.component} + ${className}`}>{children}</p>;
}

export default InputError;
