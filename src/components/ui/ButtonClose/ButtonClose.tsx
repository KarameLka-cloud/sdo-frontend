import {JSX} from "react";
import style from "./ButtonClose.module.css";
import icon_close from "../../../assets/images/icons/close.svg";

type ButtonCloseType = {
    className?: string;
    [x: string]: unknown;
}

function ButtonClose({className = "", ...props}: ButtonCloseType): JSX.Element {
    return (
        <div {...props} className={`${style.button_close} ${className}`}>
            <img src={icon_close} alt="Кнопка закрыть"/>
        </div>
    )
}

export default ButtonClose;
