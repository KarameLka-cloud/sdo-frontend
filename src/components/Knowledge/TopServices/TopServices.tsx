import { JSX } from "react";
import { Link } from "react-router-dom";
import style from "./TopServices.module.css";

function TopServices({
  href = "",
  className = "",
}: {
  href: string;
  className?: string;
}): JSX.Element {
  return (
    <>
      <div className={style.component}>
        <div className={style.title}>Услуги, изучаемых в период адаптации</div>
        <Link to={href} className={`${style.link} + ${className}`}>
          ТОП 25
        </Link>
      </div>
    </>
  );
}

export default TopServices;
