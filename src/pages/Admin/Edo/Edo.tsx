import {JSX} from "react";
import style from "./Edo.module.css";
import {Link} from "react-router-dom";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";

function Edo(): JSX.Element {
    return (
        <>
            <HeaderPage>Единый день обучения</HeaderPage>
            <div className={style.links}>
                <Link to="courses" className={style.link}>Электронные курсы</Link>
                <Link to="events" className={style.link}>Мероприятия</Link>
                <Link to="tests" className={style.link}>Тесты</Link>
            </div>
        </>
    )
}

export default Edo;
