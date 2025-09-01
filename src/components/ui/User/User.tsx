import {JSX} from "react";
import style from "./User.module.css";
import {UserType} from "../../../types/api/UserType.ts";
import ButtonEdit from "../ButtonEdit/ButtonEdit.tsx";
import ButtonClose from "../ButtonClose/ButtonClose.tsx";
import {useToggle} from "../../../hooks/useToggle.ts";

type UserPropsType = {
    user: UserType;
    className?: string;
}

function User({user, className}: UserPropsType): JSX.Element {
    const {toggle, value} = useToggle();

    return (
        <div className={`${style.user} + ${className}`}>
            <div className={style.content}>
                <div className={style.name}>{user.name}</div>
                <div className={style.department}>{user.department}</div>
            </div>
            {user.role && <div className={style.role}>{user.role_name}</div>}
            {value ? <>
                <div className={style.input}>Edit</div>
                <ButtonClose className={style.close} onClick={toggle}/>
            </> : <ButtonEdit className={style.edit} onClick={toggle}/>
            }
        </div>
    )
}

export default User;
