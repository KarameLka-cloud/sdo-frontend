import { JSX, ReactNode } from "react";
import styles from "./OverflowScrollBlock.module.css";
import HeaderPage from "@components/ui/HeaderPage/HeaderPage.tsx";

interface OverflowScrollBlockProps {
  title?: string;
  header_name: string;
  showBackButton?: boolean;
  button_back_visible?: "enable" | "disable";
  children?: ReactNode;
}

function OverflowScrollBlock({
  children,
  title,
  header_name,
  showBackButton,
  button_back_visible = "disable",
}: OverflowScrollBlockProps): JSX.Element {
  const resolvedTitle = title ?? header_name;
  const resolvedBackButtonVisibility =
    showBackButton !== undefined
      ? showBackButton
        ? "enable"
        : "disable"
      : button_back_visible;

  return (
    <div className={styles.container}>
      {/* <HeaderPage
        className={styles.header_page}
        button_back_visible={resolvedBackButtonVisibility}
      >
        {resolvedTitle}
      </HeaderPage> */}

      <div className={styles.main_content}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default OverflowScrollBlock;
