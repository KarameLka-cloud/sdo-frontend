import {JSX} from "react";
import {Link} from "react-router-dom";
import style from "./LogoLink.module.css";
import {LogoLinkType} from "../../../types/components/LogoLinkType.ts";

function LogoLink({href = "", className = ""}: LogoLinkType): JSX.Element {
    return (
        <Link to={href} className={`${className}`}>
            <img
                src="/src/assets/images/logo_mfc.svg"
                alt="LogoLink"
                className={style.logo_link}
            />
        </Link>
    );
}

export default LogoLink;
