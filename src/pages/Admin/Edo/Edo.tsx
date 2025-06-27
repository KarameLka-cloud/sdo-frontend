import {JSX} from "react";
import style from "./Edo.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import LinkService from "../../../components/ui/LinkService/LinkService.tsx";

const links = [
    {
        id: 1,
        title: "Электронные курсы",
        path: "courses",
    },
    {
        id: 2,
        title: "Мероприятия",
        path: "events",
    },
    {
        id: 3,
        title: "Тесты",
        path: "tests",
    },
]

function Edo(): JSX.Element {
    return (
        <>
            <HeaderPage>Единый день обучения</HeaderPage>
            <div className={style.links}>
                {links.map((link) => (
                    <LinkService item={link}/>
                ))}
            </div>
        </>
    )
}

export default Edo;
