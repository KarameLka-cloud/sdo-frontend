import {JSX} from "react";
import style from "./LogoutButton.module.css";
import {useNavigate} from "react-router-dom";
import icon_exit from "../../../assets/images/icons/exit.svg";
import {LogoutButtonType} from "../../../types/components/LogoutButtonType.ts";
import {useLogoutMutation} from "../../../services/store/features/auth.ts";
import Cookie from "js-cookie";

function LogoutButton({className = "", ...props}: LogoutButtonType): JSX.Element {
    const navigate = useNavigate();
    const [logoutMutation] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutMutation("").unwrap();
            Cookie.remove("auth_token");
            navigate("/login");
        } catch (error: any) {
            console.error(error);
            Cookie.remove("auth_token");
            navigate("/login");
        }
    }

    return (
        <div className={`${style.logout} + ${className}`} {...props} onClick={handleLogout}>
            <img src={icon_exit} alt="" className={style.img}/>
        </div>
    );
}

export default LogoutButton;
