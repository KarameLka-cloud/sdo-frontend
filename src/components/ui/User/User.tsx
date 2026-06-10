import { ChangeEvent, JSX, useCallback, useState } from "react";
import styles from "./User.module.css";
import { UserType } from "@/interfaces/api/UserType.ts";
import { useToggle } from "@/hooks/useToggle.ts";
import IconButton from "../IconButton/IconButton.tsx";
import {
  useGetRolesQuery,
  useAssignRoleMutation,
  useRevokeRoleMutation,
} from "@/services/store/features/user.ts";

interface UserPropsType {
  user: UserType;
  className?: string;
}

interface RoleItem {
  name: string;
  label: string;
}

function User({ user, className }: UserPropsType): JSX.Element {
  const { toggle, value } = useToggle();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { data: rolesData } = useGetRolesQuery("");
  const [assignRole] = useAssignRoleMutation();
  const [revokeRole] = useRevokeRoleMutation();

  const roles: RoleItem[] = rolesData?.data || [];

  const handleRoleSelect = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedRole(event.target.value);
    },
    [],
  );

  const handleSaveRole = useCallback(() => {
    if (selectedRole) {
      assignRole({ user_id: user.id, role: selectedRole });
      toggle();
    }
  }, [selectedRole, user.id, assignRole, toggle]);

  const handleRevokeRole = useCallback(() => {
    if (user.role) {
      revokeRole({ user_id: user.id, role: user.role });
    }
  }, [user.role, user.id, revokeRole]);

  return (
    <div className={`${styles.user} ${className ?? ""}`}>
      <div className={styles.content}>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.department}>{user.department}</div>
      </div>
      {user.role && <div className={styles.role}>{user.role_name}</div>}
      {value ? (
        <>
          <select
            name="role"
            value={selectedRole}
            onChange={handleRoleSelect}
            className={styles.select}
          >
            <option value="" disabled>
              Выбрать роль
            </option>
            {roles.map((role: RoleItem) => (
              <option key={role.name} value={role.name}>
                {role.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSaveRole}
            className={styles.saveButton}
            disabled={!selectedRole}
          >
            Сохранить
          </button>
          {user.role && (
            <button
              type="button"
              onClick={handleRevokeRole}
              className={styles.revokeButton}
            >
              Удалить роль
            </button>
          )}
          <IconButton
            type={"close"}
            onClick={toggle}
            className={styles.close}
          />
        </>
      ) : (
        <IconButton type={"edit"} onClick={toggle} className={styles.edit} />
      )}
    </div>
  );
}

export default User;
