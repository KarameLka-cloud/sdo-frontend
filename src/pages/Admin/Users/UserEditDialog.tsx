import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserType } from "@/interfaces/api/UserType.ts";
import {
  useGetRolesQuery,
  useAssignRoleMutation,
  useRevokeRoleMutation,
  type RoleOption,
} from "@/services/store/features/users.ts";
import { hasRole, type UserRole } from "@/constants/roles.ts";
import { Button } from "@/components/ui/shadcn/button";
import { Field, FieldLabel } from "@/components/ui/shadcn/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Spinner } from "@/components/ui/shadcn/spinner";
import InfoItem from "@/components/ui/custom/InfoItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";

const NO_ROLE_VALUE = "__no_rights__";

function resolveAssignedRole(
  user: UserType | null,
  roles: RoleOption[],
): string {
  if (!user) return NO_ROLE_VALUE;

  const matched = roles.find(
    (option) =>
      user.role === option.name ||
      user.role_name === option.label ||
      hasRole(user.role, user.role_name, option.name as UserRole),
  );

  return matched?.name ?? NO_ROLE_VALUE;
}

function UserEditDialog({
  user,
  open,
  onOpenChange,
}: {
  user: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: roleOptions } = useGetRolesQuery(undefined, { skip: !open });
  const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();
  const [revokeRole, { isLoading: isRevoking }] = useRevokeRoleMutation();
  const [selectedRole, setSelectedRole] = useState(NO_ROLE_VALUE);

  const roles = roleOptions ?? [];
  const currentRole = resolveAssignedRole(user, roles);
  const isSaving = isAssigning || isRevoking;

  useEffect(() => {
    if (!open) {
      setSelectedRole(NO_ROLE_VALUE);
      return;
    }

    if (!user) return;
    if ((user.role || user.role_name) && roles.length === 0) return;

    setSelectedRole(resolveAssignedRole(user, roles));
  }, [user, open, roles]);

  const handleSaveRole = async () => {
    if (!user?.id) return;

    if (selectedRole === NO_ROLE_VALUE) {
      if (currentRole === NO_ROLE_VALUE) return;

      try {
        await revokeRole({ user_id: user.id, role: currentRole }).unwrap();
        toast.success("Права отозваны");
      } catch {
        toast.error("Не удалось отозвать права");
      }
      return;
    }

    if (selectedRole === currentRole) return;

    try {
      await assignRole({ user_id: user.id, role: selectedRole }).unwrap();
      toast.success("Роль успешно назначена");
    } catch {
      toast.error("Не удалось назначить роль");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSaveRole();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {user && (
          <>
            <DialogHeader className="px-4 pt-4">
              <div className="flex items-center gap-4 pr-8">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogTitle className="text-lg">
                      {user.name}
                      {user.login ? (
                        <span className="font-normal text-muted-foreground">
                          {" "}
                          ({user.login})
                        </span>
                      ) : null}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="sr-only">
                    Редактирование роли пользователя {user.name}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <InfoItem label="Описание" value={user.description} />
                  <InfoItem label="Отдел" value={user.department} />
                  <Field className="gap-1">
                    <FieldLabel
                      htmlFor="user-role"
                      className="text-sm font-normal text-muted-foreground"
                    >
                      Роль
                    </FieldLabel>
                    <Select
                      key={`${user.id}-${roles.length}`}
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                      disabled={isSaving}
                    >
                      <SelectTrigger id="user-role" className="w-full">
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent className="z-[60]">
                        <SelectItem value={NO_ROLE_VALUE}>Нет прав</SelectItem>
                        {roles.map((role: { name: string; label: string }) => (
                          <SelectItem key={role.name} value={role.name}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={selectedRole === currentRole || isSaving}
                >
                  {isSaving && <Spinner />}
                  Сохранить
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserEditDialog;
