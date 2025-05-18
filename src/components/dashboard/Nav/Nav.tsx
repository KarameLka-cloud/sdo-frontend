import {JSX} from "react";
import {NavLink, NavLinkRenderProps} from "react-router-dom";
import style from "./Nav.module.css";

type NavLink = {
    id: number;
    name: string;
    path: string;
    icon?: string;
}

type NavProps = {
    className?: string;
    links: NavLink[];
}

function Nav({className = "", links = []}: NavProps): JSX.Element {
    return (
        <nav className={`${style.component} + ${className}`}>
            {links.map(
                ({id, name, path, icon}): JSX.Element => (
                    <NavLink
                        key={id}
                        to={path}
                        className={({isActive}: NavLinkRenderProps): string =>
                            isActive ? style.link_active : style.link_inactive
                        }
                    >
                        <img src={icon} alt="" className={style.icon}/>
                        {name}
                    </NavLink>
                )
            )}

            <a
                href="http://mfc.corp/"
                target="_blank"
                className={style.main_corp_link}
            >
                <img src="/src/assets/images/mfc_corp.png" alt="Логотип МФЦ" className={style.main_corp_image}/>
                Корпоративный портал
            </a>
        </nav>
    );
}

export default Nav;
