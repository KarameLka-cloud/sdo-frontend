import {JSX} from "react";
import style from "./Education.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import {Link} from "react-router-dom";

function EducationEducation(): JSX.Element {
    return (
        <>
            <HeaderPage>Обучение</HeaderPage>

            <div className={style.links}>
                <Link to="courses" className={style.link}>Электронные курсы</Link>
                <Link to="events" className={style.link}>Мероприятия</Link>
                <Link to="webinars" className={style.link}>Вебинары</Link>
                <Link to="tests" className={style.link}>Тесты</Link>
            </div>
        </>
    )
}

export default EducationEducation;
