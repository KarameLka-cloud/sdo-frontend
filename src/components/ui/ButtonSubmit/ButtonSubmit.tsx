import {JSX} from "react";
import style from "./ButtonSubmit.module.css";
import {ButtonSubmitType} from "../../../types/components/ButtonSubmitType.ts";

function ButtonSubmit({children, className = ""}: ButtonSubmitType): JSX.Element {
    return <button type="submit" className={`${style.button_submit} + ${className}`}>{children}</button>;
}

export default ButtonSubmit;
