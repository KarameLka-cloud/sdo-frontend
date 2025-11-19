import {JSX} from "react";
import styles from "./Knowledge.module.css";
import {Link} from "react-router-dom";
import {EXTERNAL_LINKS} from "@constants/external.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Knowledge(): JSX.Element {
    return (
        <OverflowScrollBlock header_name={'База знаний'}>
            <Link to="top" className={`${styles.top_service_component} ${styles.button}`}>
                <div className={styles.top_service_title}>
                    Услуги, изучаемых в период адаптации
                </div>
                ТОП 25
            </Link>

            <Link to={EXTERNAL_LINKS.THEORETICAL_COURSES}
                  className={`${styles.theoretical_courses_component} ${styles.button}`}>
                Теоретические курсы по услугам
            </Link>

            <Link to={EXTERNAL_LINKS.GENERAL_COURSES}
                  className={`${styles.general_courses_component} ${styles.button}`}>
                Общие курсы
            </Link>
        </OverflowScrollBlock>
    );
}

export default Knowledge;
