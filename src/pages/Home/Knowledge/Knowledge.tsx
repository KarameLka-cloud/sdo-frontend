import {JSX} from "react";
import {Link} from "react-router-dom";
import style from "./Knowledge.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";

function Knowledge(): JSX.Element {
    return (
        <>
            <HeaderPage>База знаний</HeaderPage>
            <Link to="top" className={`${style.top_service_component} ${style.button}`}>
                <div className={style.top_service_title}>
                    Услуги, изучаемых в период адаптации
                </div>
                ТОП 25
            </Link>

            <Link to="https://sdo.prod.corp/course/index.php?categoryid=39"
                  className={`${style.theoretical_courses_component} ${style.button}`}>
                Теоретические курсы по услугам
            </Link>

            <Link to="https://sdo.prod.corp/course/index.php?categoryid=40"
                  className={`${style.general_courses_component} ${style.button}`}>
                Общие курсы
            </Link>
        </>
    );
}

export default Knowledge;
