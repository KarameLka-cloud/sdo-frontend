import {JSX} from "react";
import style from "./LogoLink.module.css";
import image_logo_mfc from "../../../assets/images/logo_mfc.svg";
import {Link} from "react-router-dom";
import {LogoLinkType} from "../../../types/components/LogoLinkType.ts";

function LogoLink({href = "", className = ""}: LogoLinkType): JSX.Element {
    return (
        <Link to={href} className={`${className}`}>
            <img
                src={image_logo_mfc}
                alt="LogoLink"
                className={style.logo_link}
            />
        </Link>
    );
}

export default LogoLink;
