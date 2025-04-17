import { JSX } from "react";
import style from "./ButtonSubmit.module.css";

function ButtonSubmit({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}): JSX.Element {
  return (
    <button type="submit" className={`${style.component} + ${className}`}>
      {children}
    </button>
  );
}

export default ButtonSubmit;
