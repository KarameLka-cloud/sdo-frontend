import { JSX } from "react";
import styles from "./ButtonSubmit.module.css";

interface ButtonSubmitType {
  children: string;
  loading?: boolean;
  className?: string;
}

function ButtonSubmit({
  children,
  loading,
  className,
}: ButtonSubmitType): JSX.Element {
  return (
    <button
      type="submit"
      className={
        loading
          ? `${styles.button_submit_loading} ${className}`
          : `${styles.button_submit} ${className}`
      }
      disabled={loading}
    >
      {loading ? <div className={styles.loader}></div> : <div>{children}</div>}
    </button>
  );
}

export default ButtonSubmit;
