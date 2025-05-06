import {JSX} from "react";
import style from "./InputError.module.css";

type InputErrorProps = {
    children: string;
    className?: string;
}

function InputError({children, className = ""}: InputErrorProps): JSX.Element {
    return <p className={`${style.component} + ${className}`}>{children}</p>;
}

export default InputError;
