import { JSX } from "react";
import { Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import SidebarNav from "@/components/home/SidebarNav";
import SidebarMain from "@/components/home/SidebarMain";

function HomeLayout(): JSX.Element {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <SidebarNav />
        <SidebarMain>
          <Outlet />
        </SidebarMain>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default HomeLayout;
