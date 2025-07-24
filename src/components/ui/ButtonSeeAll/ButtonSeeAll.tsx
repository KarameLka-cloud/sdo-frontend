import {JSX} from "react";
import style from "./ButtonSeeAll.module.css";
import {ButtonSeeAllType} from "../../../types/components/ButtonSeeAllType.ts";
import {Link} from "react-router-dom";

function ButtonSeeAll({to}: ButtonSeeAllType): JSX.Element {
    return (
        <Link to={to} className={style.link}>Смотреть все</Link>
    )
}

export default ButtonSeeAll;
