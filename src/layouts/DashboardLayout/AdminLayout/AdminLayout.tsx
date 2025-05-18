import {JSX} from "react";
import {Outlet} from "react-router-dom";
import Nav from "../../../components/dashboard/Nav/Nav.tsx";
import Main from "../../../components/dashboard/Main/Main.tsx";

type NavLink = {
    id: number;
    name: string;
    path: string;
    icon?: string;
}

const links: NavLink[] =
    [
        {
            id: 1,
            name: "Пользователи",
            path: "users",
            icon: "/src/assets/images/icons/people.svg"
        },
        {
            id: 2,
            name: "Мои стажеры",
            path: "interns",
            icon: "/src/assets/images/icons/people.svg"
        },
        {
            id: 3,
            name: "База знаний",
            path: "/",
            icon: "/src/assets/images/icons/library.svg"
        },
        {
            id: 4,
            name: "Мое обучение",
            path: "/",
            icon: "/src/assets/images/icons/book.svg"
        },
        {
            id: 5,
            name: "ЕДО",
            path: "/",
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
    )
}

export default AdminLayout;
