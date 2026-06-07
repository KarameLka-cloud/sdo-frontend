import { JSX } from "react";
import { Outlet } from "react-router-dom";
import Nav from "@/components/home/Nav/Nav";
import Main from "@/components/home/Main/Main";
import { HOME_NAV_LINKS } from "@constants/navigation.ts";

function HomeLayout(): JSX.Element {
  return (
    <>
      <Nav links={HOME_NAV_LINKS} />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

export default HomeLayout;
