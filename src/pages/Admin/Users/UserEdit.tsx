import { FormEvent, JSX, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { UserType } from "@/interfaces/api/UserType.ts";
import Loader from "@/components/ui/custom/Loader";
import DataMessage from "@/components/ui/custom/DataMessage";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import {
  useGetUsersQuery,
  useGetRolesQuery,
  useAssignRoleMutation,
  useRevokeRoleMutation,
} from "@/services/store/features/user.ts";
import { ROUTES } from "@/constants/routes.ts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { cn } from "@/lib/utils";

interface RoleItem {
  name: string;
  label: string;
}

type DataMessageType = "error" | "noData";

const parseUserId = (value: string | undefined): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const getInitials = (name?: string): string => {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

function BackToUsersLink({ className }: { className?: string }) {
  return (
    <Button variant="ghost" className={cn("w-fit -ml-2", className)} asChild>
      <Link to={ROUTES.ADMIN_USERS}>
        <ArrowLeftIcon />
        К списку пользователей
      </Link>
    </Button>
  );
}

function UserRoleBadge({ user }: { user: UserType }) {
  if (user.role_name) {
    return <Badge variant="destructive">{user.role_name}</Badge>;
  }

  return <Badge variant="secondary">Пользователь</Badge>;
}

function UserInfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}

function UserEditState({
  type,
  withBackLink = true,
}: {
  type: DataMessageType;
  withBackLink?: boolean;
}) {
  return (
    <OverflowScrollBlock>
      <div className="flex flex-col gap-4">
        <DataMessage type={type} />
        {withBackLink && <BackToUsersLink />}
      </div>
    </OverflowScrollBlock>
  );
}

function UserProfileCard({ user }: { user: UserType }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <UserRoleBadge user={user} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <UserInfoItem label="Логин" value={user.login} />
          <UserInfoItem label="Отдел" value={user.department} />
          {user.description && (
            <div className="sm:col-span-2 lg:col-span-3">
              <UserInfoItem label="Описание" value={user.description} />
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

function UserRoleForm({
  user,
  roles,
  selectedRole,
  onRoleChange,
  onSave,
  onRevoke,
  isAssigning,
  isRevoking,
}: {
  user: UserType;
  roles: RoleItem[];
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onSave: () => void;
  onRevoke: () => void;
  isAssigning: boolean;
  isRevoking: boolean;
}) {
  const isSaving = isAssigning || isRevoking;
  const hasRoleChanged = selectedRole !== (user.role ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Роль</CardTitle>
        <CardDescription>
          Назначьте или измените роль пользователя в системе
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="user-role">Роль пользователя</FieldLabel>
              <Select
                value={selectedRole || undefined}
                onValueChange={onRoleChange}
                disabled={isSaving || roles.length === 0}
              >
                <SelectTrigger id="user-role" className="w-full">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {roles.length === 0
                  ? "Список ролей недоступен"
                  : "Роль определяет доступ к разделам администрирования и наставничества"}
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-wrap gap-2">
          <Button
            type="submit"
            disabled={!selectedRole || !hasRoleChanged || isSaving}
          >
            {isAssigning && <Spinner />}
            Сохранить
          </Button>
          {user.role && (
            <Button
              type="button"
              variant="destructive"
              onClick={onRevoke}
              disabled={isSaving}
            >
              {isRevoking && <Spinner />}
              Отобрать права
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

function UserEdit(): JSX.Element {
  const { userId } = useParams();
  const parsedUserId = parseUserId(userId);

  const { data, error, isLoading } = useGetUsersQuery("");
  const { data: rolesData } = useGetRolesQuery("");
  const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();
  const [revokeRole, { isLoading: isRevoking }] = useRevokeRoleMutation();

  const [selectedRole, setSelectedRole] = useState("");

  const users = (data as UserType[] | undefined) ?? [];
  const user = useMemo(
    () =>
      parsedUserId
        ? users.find((item) => item.id === parsedUserId)
        : undefined,
    [users, parsedUserId],
  );
  const roles: RoleItem[] = rolesData?.data ?? [];

  useEffect(() => {
    setSelectedRole(user?.role ?? "");
  }, [user?.role, user?.id]);

  const handleSaveRole = async () => {
    if (!user?.id || !selectedRole || selectedRole === (user.role ?? "")) {
      return;
    }

    try {
      await assignRole({ user_id: user.id, role: selectedRole }).unwrap();
      toast.success("Роль успешно назначена");
    } catch {
      toast.error("Не удалось назначить роль");
    }
  };

  const handleRevokeRole = async () => {
    if (!user?.id || !user.role) return;

    try {
      await revokeRole({ user_id: user.id, role: user.role }).unwrap();
      toast.success("Права отозваны");
    } catch {
      toast.error("Не удалось отозвать права");
    }
  };

  if (!parsedUserId) {
    return <UserEditState type="error" />;
  }

  if (isLoading) {
    return (
      <OverflowScrollBlock>
        <Loader />
      </OverflowScrollBlock>
    );
  }

  if (error) {
    return <UserEditState type="error" withBackLink={false} />;
  }

  if (!user) {
    return <UserEditState type="noData" />;
  }

  return (
    <OverflowScrollBlock>
      <div className="flex w-full flex-col gap-6">
        <BackToUsersLink />

        <UserProfileCard user={user} />

        <UserRoleForm
          user={user}
          roles={roles}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          onSave={handleSaveRole}
          onRevoke={handleRevokeRole}
          isAssigning={isAssigning}
          isRevoking={isRevoking}
        />
      </div>
    </OverflowScrollBlock>
  );
}

export default UserEdit;
