import {JSX} from "react";
import style from "./LogoutButton.module.css";

type LogoutButtonProps = {
    className: string;
    [x: string]: unknown;
}

function LogoutButton({className = "", ...props}: LogoutButtonProps): JSX.Element {
    return (
        <div className={`${style.component} + ${className}`} {...props}>
            <img src="/src/assets/images/icons/exit.svg" alt="" className={style.img}/>
        </div>
    );
}

export default LogoutButton;
