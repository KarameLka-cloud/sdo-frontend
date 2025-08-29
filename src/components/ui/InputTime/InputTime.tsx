import {JSX} from "react";
import style from "./InputTime.module.css";

type InputTimeType = {
    className?: string;
    [x: string]: unknown;
}

function InputTime({className = "", ...props}: InputTimeType): JSX.Element {
    return <input className={`${style.input_time} ${className}`} {...props} />;
}

export default InputTime;
