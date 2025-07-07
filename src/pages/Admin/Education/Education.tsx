import {JSX} from "react";
import style from "./Education.module.css";
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
        title: "Вебинары",
        path: "webinars",
    },
    {
        id: 4,
        title: "Тесты",
        path: "tests",
    },
]

function EducationEducation(): JSX.Element {
    return (
        <>
            <HeaderPage>Обучение</HeaderPage>

            <div className={style.links}>
                {links.map((link) => (
                    <LinkService key={link.id} item={link}/>
                ))}
            </div>
        </>
    )
}

export default EducationEducation;
