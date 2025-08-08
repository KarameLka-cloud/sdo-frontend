import {JSX} from "react";
import style from "./InputTime.module.css";

function InputTime({className = "", ...props}): JSX.Element {
    return <input className={`${style.input_time} ${className}`} {...props} />;
}

export default InputTime;
