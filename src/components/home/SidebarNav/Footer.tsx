import { JSX } from "react";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { SidebarFooter } from "@/components/ui/shadcn/sidebar";
import { Avatar } from "@/components/ui/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/shadcn/sidebar";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useLogout } from "@/hooks/useLogout.ts";
import { useUser } from "@/hooks/useUser";
import { getInitials } from "@/utils/getInitials.ts";

function getShortUserName(fullName: string): string {
  const [lastName = "", firstName = ""] = fullName.trim().split(/\s+/);

  if (!lastName) return "";
  if (!firstName) return lastName;

  return `${firstName} ${lastName[0]}.`;
}

function UserIdentity({
  name,
  description,
  initials,
  isLoading,
}: {
  name: string;
  description: string;
  initials: string;
  isLoading?: boolean;
}): JSX.Element {
  return (
    <>
      <Avatar className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
        <span className="text-white text-sm font-semibold">{initials}</span>
      </Avatar>
      {isLoading ? (
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ) : (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{name}</span>
          <span className="truncate text-xs">{description}</span>
        </div>
      )}
    </>
  );
}

function Footer(): JSX.Element {
  const { isMobile } = useSidebar();
  const { logout } = useLogout();
  const { name, description, isLoading } = useUser();
  const shortName = getShortUserName(name);
  const initials = getInitials(name);

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserIdentity
                  name={shortName}
                  description={description}
                  initials={initials}
                  isLoading={isLoading}
                />
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserIdentity
                    name={shortName}
                    description={description}
                    initials={initials}
                  />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

export default Footer;
