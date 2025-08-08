import {JSX} from "react";
import style from "./InputText.module.css";
import {InputTextType} from "../../../types/components/InputTextType.ts";

function InputText({className = "", ...props}: InputTextType): JSX.Element {
    return <input className={`${style.input_text} ${className}`} {...props}/>;
}

export default InputText;
