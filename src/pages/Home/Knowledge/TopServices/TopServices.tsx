import {JSX} from "react";
// import styles from "./TopServices.module.css";
import Development from "@components/ui/Development/Development.tsx";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function TopServices(): JSX.Element {
    return (
        <OverflowScrollBlock header_name={'ТОП 25'} button_back_visible={'enable'}>
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
        </OverflowScrollBlock>
    );
}

export default TopServices;
