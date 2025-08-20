import {JSX} from "react";
import style from "./ButtonSave.module.css";
import icon_save from "../../../assets/images/icons/save.svg";

function ButtonSave({className = "", ...props}: { className?: string; [x: string]: unknown; }): JSX.Element {
    return (
        <div {...props} className={`${style.button_save} ${className}`}>
            <img src={icon_save} alt="Кнопка сохранения"/>
        </div>
    )
}

export default ButtonSave;
