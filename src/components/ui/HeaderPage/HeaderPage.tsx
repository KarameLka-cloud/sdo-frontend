import { JSX } from "react";
import style from "./HeaderPage.module.css";

function HeaderPage({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}): JSX.Element {
  return <h2 className={`${style.component} + ${className}`}>{children}</h2>;
}

export default HeaderPage;
