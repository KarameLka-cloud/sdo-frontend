import {JSX} from "react";
import {Outlet} from "react-router-dom";
import icon_people from "../../../assets/images/icons/people.svg";
import icon_library from "../../../assets/images/icons/library.svg";
import icon_book from "../../../assets/images/icons/book.svg";
import icon_calendar from "../../../assets/images/icons/calendar.svg";
import Nav from "../../../components/dashboard/Nav/Nav.tsx";
import Main from "../../../components/dashboard/Main/Main.tsx";
import {NavLinkType} from "../../../interfaces/components/NavLinkType.ts";

const links: NavLinkType[] =
    [
        {
            id: 1,
            name: "Пользователи",
            path: "admin/users",
            icon: icon_people,
        },
        {
            id: 2,
            name: "База знаний",
            path: "admin/knowledge",
            icon: icon_library,
        },
        {
            id: 3,
            name: "Обучение",
            path: "admin/education",
            icon: icon_book,
        },
        {
            id: 4,
            name: "Едо",
            path: "admin/edo",
            icon: icon_calendar,
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
