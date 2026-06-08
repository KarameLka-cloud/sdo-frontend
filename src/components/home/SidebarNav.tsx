import { JSX } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import SHeader from "./SidebarNav/SHeader";
import SContent from "./SidebarNav/SContent";
import SFooter from "./SidebarNav/SFooter";

function SidebarNav(): JSX.Element {
  return (
    <Sidebar>
      <SHeader />
      <SContent />
      <SFooter />
    </Sidebar>
  );
}

export default SidebarNav;
