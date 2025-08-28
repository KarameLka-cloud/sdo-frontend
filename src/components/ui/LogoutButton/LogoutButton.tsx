import {JSX} from "react";
import style from "./LogoutButton.module.css";
import icon_exit from "../../../assets/images/icons/exit.svg";
import {LogoutButtonType} from "../../../types/components/LogoutButtonType.ts";
import {useLogout} from "../../../hooks/useLogout.ts";

function LogoutButton({className = "", ...props}: LogoutButtonType): JSX.Element {
    const {logout} = useLogout();
    return (
        <div className={`${style.logout} + ${className}`} {...props} onClick={logout}>
            <img src={icon_exit} alt="" className={style.img}/>
        </div>
    );
}

export default LogoutButton;
