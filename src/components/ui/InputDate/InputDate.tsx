import {JSX} from "react";
import style from "./InputDate.module.css";

interface InputDateType {
    className?: string;
    [x: string]: unknown;
}

function InputDate({className, ...props}: InputDateType): JSX.Element {
    return <input className={`${style.input_date} ${className}`} {...props} />
}

export default InputDate;
