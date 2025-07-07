import {JSX} from "react";
import style from "./SeeAllButton.module.css";
import {Link} from "react-router-dom";

function SeeAllButton({to}: { to: string }): JSX.Element {
    return (
        <Link to={to} className={style.link}>Смотреть все</Link>
    )
}

export default SeeAllButton;
