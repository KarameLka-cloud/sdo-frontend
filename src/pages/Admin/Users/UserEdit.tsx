import { FormEvent, JSX, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { UserType } from "@/interfaces/api/UserType.ts";
import {
  useGetUsersQuery,
  useGetRolesQuery,
  useAssignRoleMutation,
  useRevokeRoleMutation,
} from "@/services/store/features/user.ts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import {
  USER_ROUTES,
  parseEntityId,
} from "@/pages/Admin/shared/adminResourceConfig.ts";

const NO_ROLE_VALUE = "__no_rights__";

const getInitials = (name?: string) => {
  const [first = "", second = ""] = (name ?? "").split(" ");
  return `${second.charAt(0)}${first.charAt(0)}`.toUpperCase();
};

function UserInfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}

function UserProfileCard({ user }: { user: UserType }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <Badge variant={user.role_name ? "destructive" : "secondary"}>
                {user.role_name ?? "Пользователь"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UserInfoItem label="Логин" value={user.login} />
          <UserInfoItem label="Описание" value={user.description} />
          <UserInfoItem label="Отдел" value={user.department} />
        </dl>
      </CardContent>
    </Card>
  );
}

function UserRoleForm({
  currentRole,
  roles,
  selectedRole,
  onRoleChange,
  onSave,
  isSaving,
}: {
  currentRole: string;
  roles: { name: string; label: string }[];
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Роль</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4">
          <FieldGroup>
            <Field>
              <Select
                value={selectedRole}
                onValueChange={onRoleChange}
                disabled={isSaving}
              >
                <SelectTrigger id="user-role" className="w-full">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_ROLE_VALUE}>Нет прав</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </CardContent>
        <Separator />
        <CardFooter>
          <Button
            type="submit"
            disabled={selectedRole === currentRole || isSaving}
          >
            {isSaving && <Spinner />}
            Сохранить
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function UserEdit(): JSX.Element {
  const { userId } = useParams();
  const parsedUserId = parseEntityId(userId);

  const { data, error, isLoading } = useGetUsersQuery("");
  const { data: rolesData } = useGetRolesQuery("");
  const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();
  const [revokeRole, { isLoading: isRevoking }] = useRevokeRoleMutation();
  const [selectedRole, setSelectedRole] = useState(NO_ROLE_VALUE);

  const users = (data as UserType[] | undefined) ?? [];
  const user = parsedUserId
    ? users.find((item) => item.id === parsedUserId)
    : undefined;
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

  if (parsedUserId == null) {
    return (
      <AdminFormPage
        backTo={USER_ROUTES.list}
        backLabel="К списку пользователей"
        isError
      >
        <></>
      </AdminFormPage>
    );
  }

  return (
    <AdminFormPage
      backTo={USER_ROUTES.list}
      backLabel="К списку пользователей"
      isLoading={isLoading}
      isError={!!error}
      isNoData={!isLoading && !error && !user}
    >
      {user && (
        <>
          <UserProfileCard user={user} />
          <UserRoleForm
            currentRole={currentRole}
            roles={roles}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            onSave={handleSaveRole}
            isSaving={isSaving}
          />
        </>
      )}
    </AdminFormPage>
  );
}

export default UserEdit;
