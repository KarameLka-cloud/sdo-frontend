import {JSX} from "react";
import {NavLink, NavLinkRenderProps} from "react-router-dom";
import style from "./Nav.module.css";

type Link = {
    id: number;
    name: string;
    path: string;
    icon?: string;
}

const navLinks: Link[] =
    [
        {
            id: 1,
            name: "Главная",
            path: "home",
            icon: "/src/assets/images/icons/home.svg",
        },
        {
            id: 2,
            name: "Моя карьера",
            path: "career",
            icon: "/src/assets/images/icons/person.svg"
        },
        {
            id: 3,
            name: "Мои достижения",
            path: "achievements",
            icon: "/src/assets/images/icons/medal.svg"
        },
        {
            id: 4,
            name: "Мои стажеры",
            path: "interns",
            icon: "/src/assets/images/icons/people.svg"
        },
    ];

const sdoLinks: Link[] =
    [
        {
            id: 1,
            name: "База знаний",
            path: "knowledge",
            icon: "/src/assets/images/icons/library.svg"
        },
        {
            id: 2,
            name: "Мое обучение",
            path: "education",
            icon: "/src/assets/images/icons/book.svg"
        },
        {
            id: 3,
            name: "ЕДО",
            path: "edo",
            icon: "/src/assets/images/icons/calendar.svg"
        },
    ];

type NavProps = {
    className?: string;
}

function Nav({className = ""}: NavProps): JSX.Element {
    return (
        <nav className={`${style.component} + ${className}`}>
            {navLinks.map(
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

            <hr className={style.hr}/>

            <p className={style.header}>Корпоративный университет</p>

            {sdoLinks.map(
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

            <NavLink
                to="admin"
                className={({isActive}): string =>
                    isActive
                        ? `${style.link_active} + ${style.link_admin}`
                        : `${style.link_inactive} + ${style.link_admin}`
                }
            >
                Администрирование
            </NavLink>

            <a
                href="http://mfc.corp/"
                target="_blank"
                className={style.main_corp_link}
            >
                <img src="/src/assets/images/mfc_corp.png" className={style.main_corp_image}/>
                Корпоративный портал
            </a>
        </nav>
    );
}

export default Nav;
