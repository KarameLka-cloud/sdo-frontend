import {JSX} from "react";
import style from "./ButtonSubmit.module.css";

type ButtonSubmitProps = {
    children: string;
    className?: string;
}

function ButtonSubmit({children, className = ""}: ButtonSubmitProps): JSX.Element {
    return <button type="submit" className={`${style.component} + ${className}`}>{children}</button>;
}

export default ButtonSubmit;
