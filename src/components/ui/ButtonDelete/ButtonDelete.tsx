import {JSX} from "react";
import style from "./ButtonDelete.module.css";
import icon_trash from "../../../assets/images/icons/trash.svg";

function ButtonDelete({className = "", ...props}: { className?: string; [x: string]: unknown; }): JSX.Element {
    return (
        <div {...props} className={`${style.delete_button} ${className}`}>
            <img src={icon_trash} alt="Кнопка удалить"/>
        </div>
    )
}

export default ButtonDelete;
