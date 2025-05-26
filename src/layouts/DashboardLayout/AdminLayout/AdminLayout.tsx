import {JSX} from "react";
import {Outlet} from "react-router-dom";
import Nav from "../../../components/dashboard/Nav/Nav.tsx";
import Main from "../../../components/dashboard/Main/Main.tsx";
import {NavLinkType} from "../../../types/components/NavLinkType.ts";

const links: NavLinkType[] =
    [
        {
            id: 1,
            name: "Пользователи",
            path: "admin/users",
            icon: "/src/assets/images/icons/people.svg"
        },
        {
            id: 2,
            name: "База знаний",
            path: "admin/knowledge",
            icon: "/src/assets/images/icons/library.svg"
        },
        {
            id: 3,
            name: "Обучение",
            path: "admin/education",
            icon: "/src/assets/images/icons/book.svg"
        },
        {
            id: 4,
            name: "Едо",
            path: "admin/edo",
            icon: "/src/assets/images/icons/calendar.svg"
        },
    ];

function AdminLayout(): JSX.Element {
    return (
        <>
            <Nav links={links}/>
            <Main>
                <Outlet/>
            </Main>
        </>
    );
}

export default AdminLayout;
