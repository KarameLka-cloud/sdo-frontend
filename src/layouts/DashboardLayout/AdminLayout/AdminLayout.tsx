import { JSX } from "react";
import { Outlet } from "react-router-dom";
import Nav from "@components/dashboard/Nav/Nav.tsx";
import Main from "@components/dashboard/Main/Main.tsx";
import { ADMIN_NAV_LINKS } from "@constants/navigation.ts";

function AdminLayout(): JSX.Element {
  return (
    <>
      <Nav links={ADMIN_NAV_LINKS} />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

export default AdminLayout;
