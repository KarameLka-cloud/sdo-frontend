import { JSX } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/dashboard/Header/Header.tsx";
import Nav from "../../components/dashboard/Nav/Nav.tsx";
import Main from "../../components/dashboard/Main/Main.tsx";

function DashboardLayout(): JSX.Element {
  return (
    <div className="h-screen relative">
      <Header className="absolute" />
      <div className="flex w-7xl h-full mx-auto pt-14">
        <Nav />
        <Main>
          <Outlet />
        </Main>
      </div>
    </div>
  );
}

export default DashboardLayout;
