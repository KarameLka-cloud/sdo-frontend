import {
  SidebarContent,
  SidebarGroup,
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
  // AudioWaveform,
  BookOpen,
  Bot,
  // Command,
  Frame,
  // GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes.ts";
import { JSX } from "react";
import firstWednesdayData from "@/utils/firstWednesday";

function SContent(): JSX.Element {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Home",
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
          {
            title: `ЕДО | ${firstWednesdayData}`,
            url: ROUTES.EDO,
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
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
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
          {data.navMain.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
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

      <Separator />

      <SidebarGroup>
        <div className="mx-auto">Наставничество</div>

        
      </SidebarGroup>

      <Separator />

      <SidebarGroup>
        <div className="mx-auto">Администрирование</div>
        {/* <SidebarMenuItem>
          <SidebarMenuButton>
            <NavLink to={ROUTES.MENTORSHIP}>Наставничество</NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <Separator />

        <SidebarMenuItem>
          <SidebarMenuButton>
            <NavLink to={ROUTES.ADMIN}>Администрирование</NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarGroup>
    </SidebarContent>
  );
}

export default SContent;
