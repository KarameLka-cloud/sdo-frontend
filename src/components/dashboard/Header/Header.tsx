import { JSX } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import LogoLink from "../../ui/LogoLink/LogoLink.tsx";
import LogoutButton from "../../ui/LogoutButton/LogoutButton.tsx";
import { logout } from "../../../services/auth/logout.ts";
import { useGetUserByDataQuery } from "../../../features/user/user.ts";

function Header({ className = "" }: { className?: string }): JSX.Element {
  const { data } = useGetUserByDataQuery("me");

  const navigate: NavigateFunction = useNavigate();

  const handleLogout: (e: {
    preventDefault: () => void;
  }) => Promise<void> = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const result: { success: boolean } = await logout();
    if (result.success) {
      navigate("login");
    } else {
      navigate("login");
    }
  };

  return (
    <div className={`${style.component} + ${className}`}>
      <div className={style.content}>
        <LogoLink href="/" className={style.logo} />
        <div className={style.right_content}>
          {data ? (
            <div className={style.name}>
              {`${data.name.split(" ")[1]} ${data.name.split(" ")[0][0]}.`}
            </div>
          ) : null}
          <LogoutButton className={style.logout} onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}

export default Header;
