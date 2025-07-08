import {JSX} from "react";
import style from "./LogoutButton.module.css";
import icon_exit from "../../../assets/images/icons/exit.svg";
import {LogoutButtonType} from "../../../types/components/LogoutButtonType.ts";

function LogoutButton({className = "", ...props}: LogoutButtonType): JSX.Element {
    return (
        <div className={`${style.logout} + ${className}`} {...props}>
            <img src={icon_exit} alt="" className={style.img}/>
        </div>
    );
}

export default LogoutButton;
