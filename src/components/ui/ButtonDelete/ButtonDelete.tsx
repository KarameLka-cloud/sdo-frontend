import {JSX} from "react";
import style from "./ButtonDelete.module.css";
import icon_trash from "../../../assets/images/icons/trash.svg";

type ButtonDeleteType = {
    className?: string;
    [x: string]: unknown;
}

function ButtonDelete({className = "", ...props}: ButtonDeleteType): JSX.Element {
    return (
        <div {...props} className={`${style.delete_button} ${className}`}>
            <img src={icon_trash} alt="Кнопка удалить"/>
        </div>
    )
}

export default ButtonDelete;
