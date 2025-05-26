import {JSX} from "react";
import style from "./Error.module.css";
import {ErrorType} from "../../../types/components/ErrorType.ts";

function Error({children, className = ""}: ErrorType): JSX.Element {
    return <span className={`${style.error} + ${className}`}>{children}</span>;
}

export default Error;
