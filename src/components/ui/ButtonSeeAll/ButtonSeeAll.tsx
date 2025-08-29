import {JSX} from "react";
import style from "./ButtonSeeAll.module.css";
import {Link} from "react-router-dom";

type ButtonSeeAllType = {
    to: string;
}

function ButtonSeeAll({to}: ButtonSeeAllType): JSX.Element {
    return (
        <Link to={to} className={style.link}>Смотреть всё</Link>
    )
}

export default ButtonSeeAll;
