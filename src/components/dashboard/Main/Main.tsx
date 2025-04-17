import { JSX } from "react";
import style from "./Main.module.css";

function Main({
  children,
  className = "",
}: {
  children?: JSX.Element;
  className?: string;
}): JSX.Element {
  return (
    <main className={`${style.component} + ${className}`}>{children}</main>
  );
}

export default Main;
