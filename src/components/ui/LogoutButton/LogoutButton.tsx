import {JSX} from "react";
import style from "./LogoutButton.module.css";
import icon_exit from "../../../assets/images/icons/exit.svg";
import {useLogout} from "../../../hooks/useLogout.ts";

type LogoutButtonType = {
    className?: string;
    [x: string]: unknown;
}

function LogoutButton({className, ...props}: LogoutButtonType): JSX.Element {
    const {logout} = useLogout();
    return (
        <div className={`${style.logout} + ${className}`} {...props} onClick={logout}>
            <img src={icon_exit} alt="" className={style.img}/>
        </div>
    );
}

export default LogoutButton;
