import { JSX } from "react";
import style from "./HeaderPage.module.css";

function HeaderPage({ children }: { children: string }): JSX.Element {
  return <h2 className={style.component}>{children}</h2>;
}

export default HeaderPage;
