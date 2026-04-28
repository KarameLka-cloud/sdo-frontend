import { JSX } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import { useUser } from "@hooks/useUser.ts";
import LogoLink from "@components/ui/LogoLink/LogoLink.tsx";
import LogoutButton from "@components/ui/LogoutButton/LogoutButton.tsx";
import { ROUTES } from "@constants/routes.ts";
import { hasAnyRole, USER_ROLES } from "@constants/roles.ts";

interface HeaderType {
  className?: string;
}

const getShortUserName = (name: string): string => {
  const [lastName = "", firstName = ""] = name.trim().split(/\s+/);

  if (!lastName) {
    return "";
  }
  if (!firstName) {
    return lastName;
  }

  return `${firstName} ${lastName[0]}.`;
};

function Header({ className }: HeaderType): JSX.Element {
  const { name, role } = useUser();

  const isAdmin = hasAnyRole(role, [USER_ROLES.ADMIN]);
  const isMentor = hasAnyRole(role, [USER_ROLES.MENTOR]);
  const isDepartmentHead = hasAnyRole(role, [USER_ROLES.DEPARTMENT_HEAD]);
  const hasMentorAccess = isAdmin || isMentor || isDepartmentHead;

  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className={styles.content}>
        <LogoLink to={ROUTES.ROOT} className={styles.logo} />
        {(isAdmin || hasMentorAccess) && (
          <div className={styles.links}>
            <NavLink to={ROUTES.HOME} className={styles.link}>
              Главная
            </NavLink>
            {hasMentorAccess && (
              <NavLink to={ROUTES.MENTORSHIP} className={styles.link}>
                Наставничество
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to={ROUTES.ADMIN} className={styles.link}>
                Администрирование
              </NavLink>
            )}
          </div>
        )}

        <div className={styles.right_content}>
          {name && (
            <div className={styles.name}>
              {getShortUserName(name)}
            </div>
          )}
          <LogoutButton className={styles.logout} />
        </div>
      </div>
    </header>
  );
}

export default Header;
