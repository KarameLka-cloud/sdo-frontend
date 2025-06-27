import {JSX} from "react";
import style from "./InputText.module.css";
import {InputTextType} from "../../../types/components/InputTextType.ts";

function InputText({className = "", ...props}: InputTextType): JSX.Element {
    return <input {...props} className={`${style.input_text} + ${className}`}/>;
}

export default InputText;
