import {JSX} from "react";
import styles from "./TopServices.module.css";
import HeaderPage from "@components/ui/HeaderPage/HeaderPage";
import ButtonBack from "@components/ui/ButtonBack/ButtonBack.tsx";
import Development from "@components/ui/Development/Development.tsx";

function TopServices(): JSX.Element {
    return (
        <>
            <HeaderPage className={styles.header}>ТОП 25</HeaderPage>
            <ButtonBack/>

            <Development/>

            {/*<h3 className={styles.header_services}>Короткие услуги</h3>*/}

            {/*<div className={`${styles.services} ${styles.short_services}`}>*/}
            {/*    <div className={styles.service_button}>ЕСИА</div>*/}
            {/*    <div className={styles.service_button}>ЕПГУ</div>*/}
            {/*    <div className={styles.service_button}>МВД</div>*/}
            {/*    <div className={styles.service_button}>СФР</div>*/}
            {/*</div>*/}

            {/*<a*/}
            {/*    href="#"*/}
            {/*    className={`${styles.services_test} ${styles.short_services_test}`}*/}
            {/*>*/}
            {/*    Тестирование по коротким услугам*/}
            {/*</a>*/}

            {/*<h3 className={styles.header_services}>Средние услуги</h3>*/}

            {/*<div className={`${styles.services} ${styles.middle_service}`}>*/}
            {/*    <div className={styles.service_button}>МВД</div>*/}
            {/*    <div className={styles.service_button}>ФНС</div>*/}
            {/*    <div className={styles.service_button}>МСРОП</div>*/}
            {/*    <div className={styles.service_button}>ФРС</div>*/}
            {/*</div>*/}

            {/*<a*/}
            {/*    href="#"*/}
            {/*    className={`${styles.services_test} ${styles.middle_services_test}`}*/}
            {/*>*/}
            {/*    Тестирование по средним услугам*/}
            {/*</a>*/}

            {/*<h3 className={styles.header_services}>Длинные услуги</h3>*/}

            {/*<div className={`${styles.services} ${styles.long_service}`}>*/}
            {/*    <div className={styles.service_button}>МВД</div>*/}
            {/*    <div className={styles.service_button}>СФР</div>*/}
            {/*    <div className={styles.service_button}>МСРОП</div>*/}
            {/*    <div className={styles.service_button}>ФРС</div>*/}
            {/*</div>*/}

            {/*<a*/}
            {/*    href="#"*/}
            {/*    className={`${styles.services_test} ${styles.long_services_test}`}*/}
            {/*>*/}
            {/*    Тестирование по длинным услугам*/}
            {/*</a>*/}
        </>
    );
}

export default TopServices;
