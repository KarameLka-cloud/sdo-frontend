import { JSX } from "react";
import style from "./InputText.module.css";

function InputText({
  className = "",
  ...props
}: {
  className?: string;
  [x: string]: unknown;
}): JSX.Element {
  return <input {...props} className={`${style.component} + ${className}`} />;
}

export default InputText;
