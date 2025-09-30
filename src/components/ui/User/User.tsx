import {JSX, useCallback} from "react";
import styles from "./User.module.css";
import {UserType} from "@interfaces/api/UserType.ts";
import {useToggle} from "@hooks/useToggle.ts";
import IconButton from "../IconButton/IconButton.tsx";
import {useAssignAdminRoleMutation, useRevokeAdminRoleMutation} from "@services/store/features/user.ts";
import Switch from "@components/ui/Switch/Switch.tsx";

interface UserPropsType {
    user: UserType;
    className?: string;
}

function User({user, className}: UserPropsType): JSX.Element {
    const {toggle, value} = useToggle();
    const [assignAdminRole] = useAssignAdminRoleMutation();
    const [revokeAdminRole] = useRevokeAdminRoleMutation();

    const handleRoleChange = useCallback(() => {
        if (user.role) {
            revokeAdminRole({id: user.id});
        } else {
            assignAdminRole({id: user.id});
        }
    }, [user.role, user.id, revokeAdminRole, assignAdminRole]);

    return (
        <div className={`${styles.user} + ${className}`}>
            <div className={styles.content}>
                <div className={styles.name}>{user.name}</div>
                <div className={styles.department}>{user.department}</div>
            </div>
            {user.role && <div className={styles.role}>{user.role_name}</div>}
            {value ? <>
                    <Switch title={"Админ"} value={Boolean(user.role)} mutation={handleRoleChange}
                            className={styles.switch}/>
                    <IconButton type={"close"} onClick={toggle} className={styles.close}/>
                </>
                :
                <IconButton type={"edit"} onClick={toggle} className={styles.edit}/>
            }
        </div>
    )
}

export default User;
