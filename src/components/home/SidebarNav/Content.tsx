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
      <SidebarGroup>
        {HOME_NAV_LINKS.map((item) => (
          <SidebarMenu key={item.id}>
            {item.children ? (
              <SidebarMenu>
                <Collapsible asChild className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.icon && <item.icon />}
                        <span className="text-sm">{item.name}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children?.map((subItem) => (
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
              </SidebarMenu>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isNavLinkActive(item.path, current)}
                >
                  <NavLink to={item.path}>
                    {item.icon && <item.icon />}
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        ))}
      </SidebarGroup>

      {hasMentorAccess && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Наставничество</SidebarGroupLabel>
          {MENTOR_NAV_LINKS.map((item) => (
            <SidebarMenu key={item.id}>
              {item.children ? (
                <SidebarMenu>
                  <Collapsible asChild className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.icon && <item.icon />}
                          <span className="text-sm">{item.name}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isNavLinkActive(
                                  subItem.path,
                                  current,
                                )}
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
                </SidebarMenu>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavLinkActive(item.path, current)}
                  >
                    <NavLink to={item.path}>
                      {item.icon && <item.icon />}
                      <span className="text-sm">{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          ))}
        </SidebarGroup>
      )}

      {isAdmin && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Администрирование</SidebarGroupLabel>
          {ADMIN_NAV_LINKS.map((item) => (
            <SidebarMenu key={item.id}>
              {item.children ? (
                <SidebarMenu>
                  <Collapsible asChild className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.icon && <item.icon />}
                          <span className="text-sm">{item.name}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isNavLinkActive(
                                  subItem.path,
                                  current,
                                )}
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
                </SidebarMenu>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavLinkActive(item.path, current)}
                  >
                    <NavLink to={item.path}>
                      {item.icon && <item.icon />}
                      <span className="text-sm">{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          ))}
        </SidebarGroup>
      )}
    </SidebarContent>
  );
}

export default Content;
