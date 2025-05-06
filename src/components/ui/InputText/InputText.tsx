import {JSX} from "react";
import style from "./InputText.module.css";

type InputTextProps = {
    className?: string;
    [x: string]: unknown;
}

function InputText({className = "", ...props}: InputTextProps): JSX.Element {
    return <input {...props} className={`${style.component} + ${className}`}/>;
}

export default InputText;
