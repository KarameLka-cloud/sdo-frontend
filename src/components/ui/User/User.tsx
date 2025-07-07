import {JSX} from "react";
import style from "./User.module.css";
import {UserType} from "../../../types/components/UserType.ts";

type UserProps = {
    user: UserType;
    className?: string;
}

function User({user, className}: UserProps): JSX.Element {
    return (
        <div className={`${style.user} + ${className}`}>
            <div className={style.content}>
                <div className={style.name}>{user.name}</div>
                <div className={style.department}>{user.department}</div>
            </div>
            <select className={style.select}>
                <option>Пользователь</option>
                <option>Администратор</option>
            </select>
            <div className={style.save_button}>
                <img src="/src/assets/images/icons/checkmark.svg" alt="Кнопка сохранить"
                     className={style.save_button_icon}/>
            </div>
        </div>
    )
}

export default User;
