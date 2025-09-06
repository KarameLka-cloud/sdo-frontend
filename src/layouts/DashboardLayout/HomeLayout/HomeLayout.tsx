import {JSX} from "react";
import {Outlet} from "react-router-dom";
import icon_home from "../../../assets/images/icons/home.svg";
import icon_person from "../../../assets/images/icons/person.svg";
import icon_medal from "../../../assets/images/icons/medal.svg";
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
            name: "Главная",
            path: "home",
            icon: icon_home,
        },
        {
            id: 2,
            name: "Карьера",
            path: "career",
            icon: icon_person,
        },
        {
            id: 3,
            name: "Достижения",
            path: "achievements",
            icon: icon_medal,
        },
        {
            id: 4,
            name: "База знаний",
            path: "knowledge",
            icon: icon_library,
        },
        {
            id: 5,
            name: "Обучение",
            path: "education",
            icon: icon_book,
        },
        {
            id: 6,
            name: "Едо",
            path: "edo",
            icon: icon_calendar,
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
    );
}

export default HomeLayout;
