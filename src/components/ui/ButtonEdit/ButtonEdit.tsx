import {JSX} from "react";
import style from "./ButtonEdit.module.css";
import icon_pencil from "../../../assets/images/icons/pencil.svg";

function ButtonEdit({className = "", ...props}: { className?: string; [x: string]: unknown; }): JSX.Element {
    return (
        <div {...props} className={`${style.button_edit} ${className}`}>
            <img src={icon_pencil} alt="Кнопка редактировать"/>
        </div>
    )
}

export default ButtonEdit;
