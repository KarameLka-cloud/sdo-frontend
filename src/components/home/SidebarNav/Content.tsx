import { JSX } from "react";
import { NavLink } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HOME_NAV_LINKS,
  MENTOR_NAV_LINKS,
  ADMIN_NAV_LINKS,
} from "@/constants/navigation";
import { useUser } from "@/hooks/useUser.ts";
import { hasAnyRole, USER_ROLES } from "@/constants/roles.ts";

function SContent(): JSX.Element {
  const { role } = useUser();

  const isAdmin = hasAnyRole(role, [USER_ROLES.ADMIN]);
  const isMentor = hasAnyRole(role, [USER_ROLES.MENTOR]);
  const isDepartmentHead = hasAnyRole(role, [USER_ROLES.DEPARTMENT_HEAD]);

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
                            <SidebarMenuSubButton asChild>
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
                <SidebarMenuButton asChild>
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

      {(isAdmin || isMentor || isDepartmentHead) && (
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
                              <SidebarMenuSubButton asChild>
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
                  <SidebarMenuButton asChild>
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
                              <SidebarMenuSubButton asChild>
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
                  <SidebarMenuButton asChild>
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

export default SContent;
