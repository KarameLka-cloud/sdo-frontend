import { JSX } from "react";
import { Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/components/home/SidebarNav";
import SidebarMain from "@/components/home/SidebarMain";

function DashboardLayout(): JSX.Element {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <SidebarNav />
        <SidebarMain>{<Outlet />}</SidebarMain>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default DashboardLayout;
