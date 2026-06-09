import { JSX } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import SHeader from "./SidebarNav/Header";
import SContent from "./SidebarNav/Content";
import SFooter from "./SidebarNav/Footer";

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
