import {JSX} from "react";
import style from "./User.module.css";
import {UserType} from "../../../interfaces/api/UserType.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import IconButton from "../IconButton/IconButton.tsx";

interface UserPropsType {
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
                <IconButton type={"close"} onClick={toggle} className={style.close}/>
            </> : <IconButton type={"edit"} onClick={toggle} className={style.edit}/>
            }
        </div>
    )
}

export default User;
