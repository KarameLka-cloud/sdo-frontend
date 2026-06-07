import { JSX } from "react";
import styles from "./Main.module.css";

interface MainPropsType {
  children?: JSX.Element;
  className?: string;
}

function Main({ children, className }: MainPropsType): JSX.Element {
  return (
    <main className={`${styles.main} ${className ?? ""}`}>{children}</main>
  );
}

export default Main;
