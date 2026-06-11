import { JSX } from "react";
import { NavLink } from "react-router-dom";
import image_logo_mfc from "@/assets/images/logo_mfc.svg";
import { SidebarHeader } from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/routes.ts";

function Header(): JSX.Element {
  return (
    <SidebarHeader>
      <NavLink to={ROUTES.HOME}>
        <img
          src={image_logo_mfc}
          alt="LogoNavLink"
          className="w-full pl-10 pr-10"
        />
      </NavLink>
    </SidebarHeader>
  );
}

export default Header;
