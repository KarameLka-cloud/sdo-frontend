import {JSX} from "react";
import style from "./InputText.module.css";

type InputTextType = {
    className?: string;
    [x: string]: unknown;
}

function InputText({className = "", ...props}: InputTextType): JSX.Element {
    return <input className={`${style.input_text} ${className}`} {...props}/>;
}

export default InputText;
