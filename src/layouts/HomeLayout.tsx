import { JSX } from "react";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/components/home/SidebarNav";
import SidebarMain from "@/components/home/SidebarMain";
import MainLayout from "./MainLayout";

function HomeLayout(): JSX.Element {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <SidebarNav />
        <SidebarMain>
          <MainLayout />
        </SidebarMain>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default HomeLayout;
