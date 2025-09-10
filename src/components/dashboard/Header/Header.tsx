import {JSX} from "react";
import {NavLink} from "react-router-dom";
import styles from "./Header.module.css";
import {useUser} from "@hooks/useUser.ts";
import LogoLink from "@components/ui/LogoLink/LogoLink.tsx";
import LogoutButton from "@components/ui/LogoutButton/LogoutButton.tsx";
import {ROUTES} from "@constants/routes.ts";

interface HeaderType {
    className?: string;
}

function Header({className}: HeaderType): JSX.Element {
    const {name, role} = useUser();

    return (
        <header className={`${styles.header} + ${className}`}>
            <div className={styles.content}>
                <LogoLink to={ROUTES.ROOT} className={styles.logo}/>
                {role.includes("ADMIN") &&
                    <div className={styles.links}>
                        <NavLink
                            to={ROUTES.HOME}
                            className={styles.link}
                        >
                            Главная
                        </NavLink>
                        <NavLink
                            to={ROUTES.ADMIN}
                            className={styles.link}
                        >
                            Администрирование
                        </NavLink>
                    </div>
                }

                <div className={styles.right_content}>
                    {name && (
                        <div className={styles.name}>
                            {`${name.split(" ")[1]} ${name.split(" ")[0][0]}.`}
                        </div>
                    )}
                    <LogoutButton className={styles.logout}/>
                </div>
            </div>
        </header>
    );
}

export default Header;
