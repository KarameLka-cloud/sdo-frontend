import {JSX} from "react";
import styles from "./Nav.module.css";
import {NavLink, NavLinkRenderProps} from "react-router-dom";
import image_mfc_corp from "@assets/images/mfc_corp.png";
import {NavLinkType} from "@interfaces/components/NavLinkType.ts";
import {EXTERNAL_LINKS} from "@constants/external.ts";

interface NavType {
    className?: string;
    links: readonly NavLinkType[];
}

function Nav({className, links}: NavType): JSX.Element {
    return (
        <nav className={`${styles.nav} ${className ?? ""}`}>
            {links.map(
                ({id, name, path, icon}): JSX.Element => (
                    <NavLink
                        key={id}
                        to={path}
                        className={({isActive}: NavLinkRenderProps): string =>
                            isActive ? `${styles.link} ${styles.link_active}` : `${styles.link} ${styles.link_inactive}`
                        }
                    >
                        <img src={icon} alt="" className={styles.icon}/>
                        {name}
                    </NavLink>
                )
            )}

            <a
                href={EXTERNAL_LINKS.MFC_CORP}
                target="_blank"
                className={styles.main_corp_link}
            >
                <img src={image_mfc_corp} alt="Логотип МФЦ" className={styles.main_corp_image}/>
                Корпоративный портал
            </a>
        </nav>
    );
}

export default Nav;
