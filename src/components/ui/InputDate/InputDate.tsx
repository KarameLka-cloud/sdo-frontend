import {JSX} from "react";
import style from "./InputDate.module.css";

function InputDate({className = "", ...props}): JSX.Element {
    return <input className={`${style.input_date} ${className}`} {...props} />
}

export default InputDate;
