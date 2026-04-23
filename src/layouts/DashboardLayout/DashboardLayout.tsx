import { JSX } from "react";
import styles from "./DashboardLayout.module.css";
import { Outlet } from "react-router-dom";
import Header from "@components/dashboard/Header/Header.tsx";

function DashboardLayout(): JSX.Element {
  return (
    <div className={styles.dashboard_layout}>
      <Header className={styles.header} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
