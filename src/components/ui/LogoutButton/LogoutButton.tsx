import { JSX } from "react";
import styles from "./LogoutButton.module.css";
import exitIcon from "@assets/images/icons/exit.svg";
import { useLogout } from "@hooks/useLogout.ts";

type LogoutButtonType = {
  className?: string;
  [x: string]: unknown;
};

function LogoutButton({ className, ...props }: LogoutButtonType): JSX.Element {
  const { logout } = useLogout();
  return (
    <div
      className={`${styles.logout} + ${className}`}
      {...props}
      onClick={logout}
    >
      <img src={exitIcon} alt="" className={styles.img} />
    </div>
  );
}

export default LogoutButton;
