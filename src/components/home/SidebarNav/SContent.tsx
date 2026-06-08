import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  // AudioWaveform,
  BookOpen,
  Bot,
  Folder,
  Forward,
  // Command,
  Frame,
  // GalleryVerticalEnd,
  Map,
  MoreHorizontal,
  PieChart,
  Settings2,
  SquareTerminal,
  Trash2,
  Home,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes.ts";
import { JSX } from "react";
import firstWednesdayData from "@/utils/firstWednesday";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SContent(): JSX.Element {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: `ЕДО | ${firstWednesdayData}`,
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Главная",
            url: ROUTES.HOME,
          },
          {
            title: "Адаптация",
            url: ROUTES.ADAPTATION,
          },
          {
            title: "Образование",
            url: ROUTES.EDUCATION,
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <SidebarContent className="pt-10">
      <SidebarGroup>
        <SidebarMenu>
          {/* {data.projects.map((item) => ( */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="home">
                {/* <item.icon /> */}
                <Home />
                <span>Главная</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* ))} */}
        </SidebarMenu>
        <SidebarMenu>
          {/* {data.projects.map((item) => ( */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="adaptation">
                {/* <item.icon /> */}
                <Bot />
                <span>Адаптация</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* ))} */}
        </SidebarMenu>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              // defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={subItem.url}>
                            <span>{subItem.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Наставничество</SidebarGroupLabel>
        <SidebarMenu>
          {/* {data.projects.map((item) => ( */}
          <SidebarMenuItem key={0}>
            <SidebarMenuButton asChild>
              <NavLink to="admin">
                {/* <item.icon /> */}
                <Frame />
                <span>Пользователи</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* ))} */}
        </SidebarMenu>
        <SidebarMenu>
          {/* {data.projects.map((item) => ( */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="admin/adaptation/templates">
                {/* <item.icon /> */}
                <Frame />
                <span>Адаптация</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* ))} */}
        </SidebarMenu>
        <SidebarMenu>
          <Collapsible
            asChild
            // defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="asdfsdfsdf">
                  {/* {item.icon && <item.icon />}
                  <span>{item.title}</span> */}
                  <span>asfsdf</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="">
                        <span>sdfsdf</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
        <SidebarMenu>
          <Collapsible
            asChild
            // defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="asdfsdfsdf">
                  {/* {item.icon && <item.icon />}
                  <span>{item.title}</span> */}
                  <span>asfsdf</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="">
                        <span>sdfsdf</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
        <SidebarMenu>
          <Collapsible
            asChild
            // defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="asdfsdfsdf">
                  {/* {item.icon && <item.icon />}
                  <span>{item.title}</span> */}
                  <span>asfsdf</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="">
                        <span>sdfsdf</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Администрирование</SidebarGroupLabel>
        <SidebarMenu>
          {/* {data.projects.map((item) => ( */}
          <SidebarMenuItem key={0}>
            <SidebarMenuButton asChild>
              <NavLink to="admin">
                {/* <item.icon /> */}
                <Frame />
                <span>Пользователи</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* ))} */}
        </SidebarMenu>
        <SidebarMenu>
          {/* {data.projects.map((item) => ( */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="admin/adaptation/templates">
                {/* <item.icon /> */}
                <Frame />
                <span>Адаптация</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* ))} */}
        </SidebarMenu>
        <SidebarMenu>
          <Collapsible
            asChild
            // defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="asdfsdfsdf">
                  {/* {item.icon && <item.icon />}
                  <span>{item.title}</span> */}
                  <span>asfsdf</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="">
                        <span>sdfsdf</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
        <SidebarMenu>
          <Collapsible
            asChild
            // defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="asdfsdfsdf">
                  {/* {item.icon && <item.icon />}
                  <span>{item.title}</span> */}
                  <span>asfsdf</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="">
                        <span>sdfsdf</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
        <SidebarMenu>
          <Collapsible
            asChild
            // defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="asdfsdfsdf">
                  {/* {item.icon && <item.icon />}
                  <span>{item.title}</span> */}
                  <span>asfsdf</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="">
                        <span>sdfsdf</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

export default SContent;
