import { JSX } from "react";
import styles from "./HeaderPage.module.css";
import { ReactNode } from "react";
import ButtonBack from "@components/ui/ButtonBack/ButtonBack.tsx";

interface HeaderPageType {
  children: ReactNode;
  button_back_visible: "enable" | "disable";
  className?: string;
}

function HeaderPage({
  children,
  button_back_visible = "disable",
  className,
}: HeaderPageType): JSX.Element {
  return (
    <div className={`${styles.header_page} ${className}`}>
      <div className={styles.content}>
        {button_back_visible === "enable" && (
          <ButtonBack className={styles.button_back} />
        )}
        <div className={styles.text_content}>{children}</div>
      </div>
    </div>
  );
}

export default HeaderPage;
