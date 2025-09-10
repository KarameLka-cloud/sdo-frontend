import {JSX} from "react";
import style from "./Nav.module.css";
import image_mfc_corp from "../../../assets/images/mfc_corp.png";
import {NavLink, NavLinkRenderProps} from "react-router-dom";
import {NavLinkType} from "../../../interfaces/components/NavLinkType.ts";
import {EXTERNAL_LINKS} from "../../../constants/external.ts";

interface NavType {
    className?: string;
    links: readonly NavLinkType[];
}

function Nav({className, links}: NavType): JSX.Element {
    return (
        <nav className={`${style.nav} + ${className}`}>
            {links.map(
                ({id, name, path, icon}): JSX.Element => (
                    <NavLink
                        key={id}
                        to={path}
                        className={({isActive}: NavLinkRenderProps): string =>
                            isActive ? `${style.link} ${style.link_active}` : `${style.link} ${style.link_inactive}`
                        }
                    >
                        <img src={icon} alt="" className={style.icon}/>
                        {name}
                    </NavLink>
                )
            )}

            <a
                href={EXTERNAL_LINKS.MFC_CORP}
                target="_blank"
                className={style.main_corp_link}
            >
                <img src={image_mfc_corp} alt="Логотип МФЦ" className={style.main_corp_image}/>
                Корпоративный портал
            </a>
        </nav>
    );
}

export default Nav;
