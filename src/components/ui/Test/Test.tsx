import {JSX} from "react";
import style from "./Test.module.css";
import {TestType} from "../../../types/components/TestType.ts";

type TestProps = {
    className?: string;
    test: TestType,
    // mutation?: any,
}

function Test({className, test}: TestProps): JSX.Element {
    return (
        <div className={`${style.test} + ${className}`} onClick={() => window.open(test.url, "_blank")}>
            <div className={style.title}>{test.title}</div>
            <div className={style.date_end}>{`Пройти до ${test.date_end}г.`}</div>
        </div>
    )
}

export default Test;
