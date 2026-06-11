import { JSX } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import Header from "./SidebarNav/Header";
import Content from "./SidebarNav/Content";
import Footer from "./SidebarNav/Footer";

function SidebarNav(): JSX.Element {
  return (
    <Sidebar>
      <Header />
      <Content />
      <Footer />
    </Sidebar>
  );
}

export default SidebarNav;
