import { JSX } from "react";
import { Outlet } from "react-router-dom";
import Nav from "@components/dashboard/Nav/Nav.tsx";
import Main from "@components/dashboard/Main/Main.tsx";
import { MENTOR_NAV_LINKS } from "@constants/navigation.ts";

function MentorshipLayout(): JSX.Element {
  return (
    <>
      <Nav links={MENTOR_NAV_LINKS} />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

export default MentorshipLayout;
