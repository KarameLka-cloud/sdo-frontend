import { ChangeEvent, JSX, useCallback, useState } from "react";
import { UserType } from "@/interfaces/api/UserType.ts";
import { useToggle } from "@/hooks/useToggle.ts";
import IconButton from "./IconButton.tsx";
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
    <div
      className={`flex items-center py-1.5 px-4 rounded-2xl bg-gray-200 ${className || ""}`}
    >
      <div className="flex-1">
        <div className="text-base">{user.name}</div>
        <div className="text-gray-500 text-sm">{user.department}</div>
      </div>

      {user.role && (
        <div className="ml-4 py-0.5 px-1.5 bg-red-600 rounded-lg text-white text-xs font-semibold uppercase">
          {user.role_name}
        </div>
      )}

      {value ? (
        <>
          <select
            name="role"
            value={selectedRole}
            onChange={handleRoleSelect}
            className="ml-auto py-1.5 px-2 rounded-lg border border-gray-500 bg-white text-sm cursor-pointer focus:outline-none focus:border-blue-600"
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
            disabled={!selectedRole}
            className="ml-2 py-1.5 px-3 rounded-lg border-none bg-green-600 text-white text-sm cursor-pointer transition-colors duration-200 hover:bg-green-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Сохранить
          </button>

          {user.role && (
            <button
              type="button"
              onClick={handleRevokeRole}
              className="ml-2 py-1.5 px-3 rounded-lg border-none bg-red-600 text-white text-sm cursor-pointer transition-colors duration-200 hover:bg-red-800"
            >
              Удалить роль
            </button>
          )}

          <IconButton type={"close"} onClick={toggle} className="ml-4" />
        </>
      ) : (
        <IconButton type={"edit"} onClick={toggle} className="ml-auto" />
      )}
    </div>
  );
}

export default User;
