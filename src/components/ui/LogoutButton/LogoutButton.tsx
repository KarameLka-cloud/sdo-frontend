import {JSX} from "react";
import style from "./LogoutButton.module.css";
import exitIcon from "../../../assets/images/icons/exit.svg";
import {useLogout} from "../../../hooks/useLogout.ts";

type LogoutButtonType = {
    className?: string;
    [x: string]: unknown;
}

function LogoutButton({className, ...props}: LogoutButtonType): JSX.Element {
    const {logout} = useLogout();
    return (
        <div className={`${style.logout} + ${className}`} {...props} onClick={logout}>
            <img src={exitIcon} alt="" className={style.img}/>
        </div>
    );
}

export default LogoutButton;
