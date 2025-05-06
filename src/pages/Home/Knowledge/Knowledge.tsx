import {JSX} from "react";
import {Link} from "react-router-dom";
import style from "./Knowledge.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";

function Knowledge(): JSX.Element {
    return (
        <>
            <HeaderPage>База знаний</HeaderPage>
            <div className={style.top_service_component}>
                <div className={style.top_service_title}>
                    Услуги, изучаемых в период адаптации
                </div>
                <Link to="top" className={style.top_service_link}>
                    ТОП 25
                </Link>
            </div>

            <div className={style.theoretical_courses_component}>
                <Link to="/" className={style.theoretical_courses_title}>
                    Теоретические курсы по услугам
                </Link>
            </div>

            <div className={style.general_courses_component}>
                <Link to="/" className={style.general_courses_title}>
                    Общие курсы
                </Link>
            </div>
        </>
    );
}

export default Knowledge;
