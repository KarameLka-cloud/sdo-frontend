import {JSX} from "react";
import style from "./Test.module.css";
import convertDate from "../../../utils/convertDate.ts";
import {TestType} from "../../../types/api/TestType.ts";

type TestPropsType = {
    className?: string;
    test: TestType;
}

function Test({className, test}: TestPropsType): JSX.Element {
    return (
        <div className={`${style.test} + ${className}`} onClick={() => window.open(test.url, "_blank")}>
            <div className={style.content}>
                <div className={style.title}>{test.title}</div>
                <div className={style.date_end}>{`Пройти до ${convertDate(test.date_end)}г.`}</div>
            </div>
        </div>
    )
}

export default Test;
