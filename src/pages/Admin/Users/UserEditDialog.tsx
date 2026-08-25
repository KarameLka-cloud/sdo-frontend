import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserType } from "@/interfaces/api/UserType.ts";
import {
  useGetRolesQuery,
  useAssignRoleMutation,
  useRevokeRoleMutation,
} from "@/services/store/features/user.ts";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";

const NO_ROLE_VALUE = "__no_rights__";

function UserInfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value || "—"}</dd>
    </div>
  );
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
  const { data: rolesData } = useGetRolesQuery("", { skip: !open });
  const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();
  const [revokeRole, { isLoading: isRevoking }] = useRevokeRoleMutation();
  const [selectedRole, setSelectedRole] = useState(NO_ROLE_VALUE);

  const roles = rolesData?.data ?? [];
  const currentRole = user?.role ?? NO_ROLE_VALUE;
  const isSaving = isAssigning || isRevoking;

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role ?? NO_ROLE_VALUE);
    }
  }, [user]);

  const handleSaveRole = async () => {
    if (!user?.id) return;

    if (selectedRole === NO_ROLE_VALUE) {
      if (!user.role) return;

      try {
        await revokeRole({ user_id: user.id, role: user.role }).unwrap();
        toast.success("Права отозваны");
      } catch {
        toast.error("Не удалось отозвать права");
      }
      return;
    }

    if (selectedRole === user.role) return;

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
      <DialogContent className="sm:max-w-2xl">
        {user && (
          <>
            <DialogHeader>
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <UserInfoItem label="Описание" value={user.description} />
                <UserInfoItem label="Отдел" value={user.department} />
                <Field className="gap-1">
                  <FieldLabel
                    htmlFor="user-role"
                    className="text-sm font-normal text-muted-foreground"
                  >
                    Роль
                  </FieldLabel>
                  <Select
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
