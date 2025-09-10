import {JSX} from "react";
import styles from "./User.module.css";
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
        <div className={`${styles.user} + ${className}`}>
            <div className={styles.content}>
                <div className={styles.name}>{user.name}</div>
                <div className={styles.department}>{user.department}</div>
            </div>
            {user.role && <div className={styles.role}>{user.role_name}</div>}
            {value ? <>
                <div className={styles.input}>Edit</div>
                <IconButton type={"close"} onClick={toggle} className={styles.close}/>
            </> : <IconButton type={"edit"} onClick={toggle} className={styles.edit}/>
            }
        </div>
    )
}

export default User;
