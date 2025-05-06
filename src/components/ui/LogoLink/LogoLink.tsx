import {JSX} from "react";
import {Link} from "react-router-dom";
import style from "./LogoLink.module.css";

type LogoLinkProps = {
    href?: string;
    className?: string;
}

function LogoLink({href = "", className = ""}: LogoLinkProps): JSX.Element {
    return (
        <Link to={href} className={`${className}`}>
            <img
                src="/src/assets/images/logo_mfc.svg"
                alt="LogoLink"
                className={style.img}
            />
        </Link>
    );
}

export default LogoLink;
