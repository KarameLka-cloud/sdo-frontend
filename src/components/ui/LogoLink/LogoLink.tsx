import {JSX} from "react";
import style from "./LogoLink.module.css";
import image_logo_mfc from "../../../assets/images/logo_mfc.svg";
import {Link} from "react-router-dom";

interface LogoLinkType {
    to?: string;
    className?: string;
}

function LogoLink({to = "", className}: LogoLinkType): JSX.Element {
    return (
        <Link to={to} className={`${className}`}>
            <img
                src={image_logo_mfc}
                alt="LogoLink"
                className={style.logo_link}
            />
        </Link>
    );
}

export default LogoLink;
