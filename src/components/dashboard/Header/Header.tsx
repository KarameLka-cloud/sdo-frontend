import {JSX} from "react";
import {NavLink} from "react-router-dom";
import style from "./Header.module.css";
import LogoLink from "../../ui/LogoLink/LogoLink.tsx";
import LogoutButton from "../../ui/LogoutButton/LogoutButton.tsx";
import {useGetUserByDataQuery} from "../../../services/store/features/user.ts";
import {HeaderType} from "../../../types/components/HeaderType.ts";

function Header({className = ""}: HeaderType): JSX.Element {
    const {data} = useGetUserByDataQuery("me");

    return (
        <header className={`${style.header} + ${className}`}>
            <div className={style.content}>
                <LogoLink href="/" className={style.logo}/>
                <div className={style.links}>
                    <NavLink
                        to="/"
                        className={style.link}
                    >
                        Главная
                    </NavLink>
                    <NavLink
                        to="admin"
                        className={style.link}
                    >
                        Администрирование
                    </NavLink>
                </div>
                <div className={style.right_content}>
                    {data ? (
                        <div className={style.name}>
                            {`${data.name.split(" ")[1]} ${data.name.split(" ")[0][0]}.`}
                        </div>
                    ) : null}
                    <LogoutButton className={style.logout}/>
                </div>
            </div>
        </header>
    );
}

export default Header;
