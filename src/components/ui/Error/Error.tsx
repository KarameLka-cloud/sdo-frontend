import {JSX} from "react";
import style from "./Error.module.css";

type ErrorType = {
    children: string;
    className?: string;
}

function Error({children, className = ""}: ErrorType): JSX.Element {
    return <span className={`${style.error} + ${className}`}>{children}</span>;
}

export default Error;
