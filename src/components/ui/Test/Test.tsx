import {JSX} from "react";
import styles from "./Test.module.css";
import convertDate from "@utils/convertDate.ts";
import {TestType} from "@interfaces/api/TestType.ts";

interface TestPropsType {
    className?: string;
    test: TestType;
}

function Test({className, test}: TestPropsType): JSX.Element {
    return (
        <div className={`${styles.test} + ${className}`} onClick={() => window.open(test.url, "_blank")}>
            <div className={styles.content}>
                <div className={styles.title}>{test.title}</div>
                <div className={styles.date_end}>{`Пройти до ${convertDate(test.date_end)}г.`}</div>
            </div>
        </div>
    )
}

export default Test;
