import {JSX} from "react";
import {NavLink} from "react-router-dom";
import style from "./Header.module.css";
import {useUser} from "../../../hooks/useUser.ts";
import LogoLink from "../../ui/LogoLink/LogoLink.tsx";
import LogoutButton from "../../ui/LogoutButton/LogoutButton.tsx";
import {ROUTES} from "../../../constants/routes.ts";

interface HeaderType {
    className?: string;
}

function Header({className}: HeaderType): JSX.Element {
    const {name, role} = useUser();

    return (
        <header className={`${style.header} + ${className}`}>
            <div className={style.content}>
                <LogoLink to={ROUTES.ROOT} className={style.logo}/>
                {role.includes("ADMIN") &&
                    <div className={style.links}>
                        <NavLink
                            to={ROUTES.HOME}
                            className={style.link}
                        >
                            Главная
                        </NavLink>
                        <NavLink
                            to={ROUTES.ADMIN}
                            className={style.link}
                        >
                            Администрирование
                        </NavLink>
                    </div>
                }

                <div className={style.right_content}>
                    {name && (
                        <div className={style.name}>
                            {`${name.split(" ")[1]} ${name.split(" ")[0][0]}.`}
                        </div>
                    )}
                    <LogoutButton className={style.logout}/>
                </div>
            </div>
        </header>
    );
}

export default Header;
