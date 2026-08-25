import { JSX } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/shadcn/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcn/collapsible";
import {
  HOME_NAV_LINKS,
  MENTOR_NAV_LINKS,
  ADMIN_NAV_LINKS,
  type NavigationItem,
} from "@/constants/navigation";
import { useUser } from "@/hooks/useUser.ts";
import {
  hasAnyRoleFromUser,
  MENTOR_ACCESS_ROLES,
  USER_ROLES,
} from "@/constants/roles.ts";

function isNavLinkActive(targetPath: string, current: string): boolean {
  const targetUrl = new URL(targetPath, "http://local");
  const currentUrl = new URL(current, "http://local");

  if (targetUrl.pathname !== currentUrl.pathname) {
    return false;
  }

  if (!targetUrl.search) {
    return true;
  }

  for (const [key, value] of targetUrl.searchParams.entries()) {
    if (currentUrl.searchParams.get(key) !== value) {
      return false;
    }
  }

  return true;
}

function NavItem({
  item,
  current,
}: {
  item: NavigationItem;
  current: string;
}): JSX.Element {
  if (item.children) {
    return (
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <item.icon />
              <span className="text-sm">{item.name}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((subItem) => (
                <SidebarMenuSubItem key={subItem.id}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isNavLinkActive(subItem.path, current)}
                  >
                    <NavLink to={subItem.path}>
                      <span>{subItem.name}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isNavLinkActive(item.path, current)}>
        <NavLink to={item.path}>
          <item.icon />
          <span className="text-sm">{item.name}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavLinks({
  items,
  current,
  label,
  hideOnIconCollapse = false,
}: {
  items: ReadonlyArray<NavigationItem>;
  current: string;
  label?: string;
  hideOnIconCollapse?: boolean;
}): JSX.Element {
  return (
    <SidebarGroup
      className={
        hideOnIconCollapse ? "group-data-[collapsible=icon]:hidden" : undefined
      }
    >
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      {items.map((item) => (
        <SidebarMenu key={item.id}>
          <NavItem item={item} current={current} />
        </SidebarMenu>
      ))}
    </SidebarGroup>
  );
}

function Content(): JSX.Element {
  const { role, role_name: roleName } = useUser();
  const location = useLocation();
  const current = `${location.pathname}${location.search}`;

  const isAdmin = hasAnyRoleFromUser(role, roleName, [USER_ROLES.ADMIN]);
  const hasMentorAccess = hasAnyRoleFromUser(
    role,
    roleName,
    MENTOR_ACCESS_ROLES,
  );

  return (
    <SidebarContent className="pt-10">
      <NavLinks items={HOME_NAV_LINKS} current={current} />
      {hasMentorAccess && (
        <NavLinks
          items={MENTOR_NAV_LINKS}
          current={current}
          label="Наставничество"
          hideOnIconCollapse
        />
      )}
      {isAdmin && (
        <NavLinks
          items={ADMIN_NAV_LINKS}
          current={current}
          label="Администрирование"
          hideOnIconCollapse
        />
      )}
    </SidebarContent>
  );
}

export default Content;
