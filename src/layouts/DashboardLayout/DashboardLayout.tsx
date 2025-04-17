import { JSX } from "react";
import { Outlet } from "react-router-dom";
import style from "./DashboardLayout.module.css";
import Header from "../../components/dashboard/Header/Header.tsx";
import Nav from "../../components/dashboard/Nav/Nav.tsx";
import Main from "../../components/dashboard/Main/Main.tsx";

function DashboardLayout(): JSX.Element {
  return (
    <div className={style.component}>
      <Header className={style.header} />
      <div className={style.content}>
        <Nav />
        <Main>
          <Outlet />
        </Main>
      </div>
    </div>
  );
}

export default DashboardLayout;
