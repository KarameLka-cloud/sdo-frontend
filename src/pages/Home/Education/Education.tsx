import {JSX} from "react";
// import style from "../Edo/Edo.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import Development from "../../../components/ui/Development/Development.tsx";

function Education(): JSX.Element {
    // return (
    //     <>
    //         <HeaderPage>Обучение</HeaderPage>
    //
    //         <h3 className={style.header_services}>Электронные курсы</h3>
    //         <div className={style.container}></div>
    //
    //         <h3 className={style.header_services}>Мероприятия</h3>
    //         <div className={style.container}></div>
    //
    //         <h3 className={style.header_services}>Вебинары</h3>
    //         <div className={style.container}></div>
    //
    //         <h3 className={style.header_services}>Назначенные тесты</h3>
    //         <div className={style.container}></div>
    //     </>
    // );
    return (
        <>
            <HeaderPage>Обучение</HeaderPage>

            <Development/>
        </>
    )
}

export default Education;
