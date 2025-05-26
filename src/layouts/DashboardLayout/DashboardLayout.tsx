import {JSX} from "react";
import {Outlet} from "react-router-dom";
import style from "./DashboardLayout.module.css";
import Header from "../../components/dashboard/Header/Header.tsx";

function DashboardLayout(): JSX.Element {
    return (
        <div className={style.dashboard_layout}>
            <Header className={style.header}/>
            <div className={style.content}>
                <Outlet/>
            </div>
        </div>
    );
}

export default DashboardLayout;
