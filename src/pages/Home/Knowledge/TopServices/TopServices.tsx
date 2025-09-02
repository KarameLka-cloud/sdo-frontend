import {JSX} from "react";
import style from "./TopServices.module.css";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import Development from "../../../../components/ui/Development/Development.tsx";

function TopServices(): JSX.Element {
    return (
        <>
            <HeaderPage className={style.header}>ТОП 25</HeaderPage>
            <ButtonBack/>

            <Development/>

            {/*<h3 className={style.header_services}>Короткие услуги</h3>*/}

            {/*<div className={`${style.services} ${style.short_services}`}>*/}
            {/*    <div className={style.service_button}>ЕСИА</div>*/}
            {/*    <div className={style.service_button}>ЕПГУ</div>*/}
            {/*    <div className={style.service_button}>МВД</div>*/}
            {/*    <div className={style.service_button}>СФР</div>*/}
            {/*</div>*/}

            {/*<a*/}
            {/*    href="#"*/}
            {/*    className={`${style.services_test} ${style.short_services_test}`}*/}
            {/*>*/}
            {/*    Тестирование по коротким услугам*/}
            {/*</a>*/}

            {/*<h3 className={style.header_services}>Средние услуги</h3>*/}

            {/*<div className={`${style.services} ${style.middle_service}`}>*/}
            {/*    <div className={style.service_button}>МВД</div>*/}
            {/*    <div className={style.service_button}>ФНС</div>*/}
            {/*    <div className={style.service_button}>МСРОП</div>*/}
            {/*    <div className={style.service_button}>ФРС</div>*/}
            {/*</div>*/}

            {/*<a*/}
            {/*    href="#"*/}
            {/*    className={`${style.services_test} ${style.middle_services_test}`}*/}
            {/*>*/}
            {/*    Тестирование по средним услугам*/}
            {/*</a>*/}

            {/*<h3 className={style.header_services}>Длинные услуги</h3>*/}

            {/*<div className={`${style.services} ${style.long_service}`}>*/}
            {/*    <div className={style.service_button}>МВД</div>*/}
            {/*    <div className={style.service_button}>СФР</div>*/}
            {/*    <div className={style.service_button}>МСРОП</div>*/}
            {/*    <div className={style.service_button}>ФРС</div>*/}
            {/*</div>*/}

            {/*<a*/}
            {/*    href="#"*/}
            {/*    className={`${style.services_test} ${style.long_services_test}`}*/}
            {/*>*/}
            {/*    Тестирование по длинным услугам*/}
            {/*</a>*/}
        </>
    );
}

export default TopServices;
