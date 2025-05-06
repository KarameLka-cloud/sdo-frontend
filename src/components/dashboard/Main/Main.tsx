import {JSX} from "react";
import style from "./Main.module.css";

type MainProps = {
    children?: JSX.Element;
    className?: string;
};

function Main({children, className = ""}: MainProps): JSX.Element {
    return (
        <main className={`${style.component} + ${className}`}>{children}</main>
    );
}

export default Main;
