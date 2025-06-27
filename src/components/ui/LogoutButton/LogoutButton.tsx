import {JSX} from "react";
import style from "./LogoutButton.module.css";
import {LogoutButtonType} from "../../../types/components/LogoutButtonType.ts";

function LogoutButton({className = "", ...props}: LogoutButtonType): JSX.Element {
    return (
        <div className={`${style.logout} + ${className}`} {...props}>
            <img src="/src/assets/images/icons/exit.svg" alt="" className={style.img}/>
        </div>
    );
}

export default LogoutButton;
