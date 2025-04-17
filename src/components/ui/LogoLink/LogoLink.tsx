import { JSX } from "react";
import { Link } from "react-router-dom";
import style from "./LogoLink.module.css";

function LogoLink({
  href = "",
  className = "",
}: {
  href?: string;
  className?: string;
}): JSX.Element {
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
