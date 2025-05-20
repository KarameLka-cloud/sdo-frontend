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
            name: "Главная",
            path: "user/home",
            icon: "/src/assets/images/icons/home.svg",
        },
        {
            id: 2,
            name: "Карьера",
            path: "user/career",
            icon: "/src/assets/images/icons/person.svg"
        },
        {
            id: 3,
            name: "Достижения",
            path: "user/achievements",
            icon: "/src/assets/images/icons/medal.svg"
        },
        {
            id: 4,
            name: "База знаний",
            path: "user/knowledge",
            icon: "/src/assets/images/icons/library.svg"
        },
        {
            id: 5,
            name: "Обучение",
            path: "user/education",
            icon: "/src/assets/images/icons/book.svg"
        },
        {
            id: 6,
            name: "Едо",
            path: "user/edo",
            icon: "/src/assets/images/icons/calendar.svg"
        },
    ];

function HomeLayout(): JSX.Element {
    return (
        <>
            <Nav links={links}/>
            <Main>
                <Outlet/>
            </Main>
        </>
    )
}

export default HomeLayout;
