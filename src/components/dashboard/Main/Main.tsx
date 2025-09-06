import {JSX} from "react";
import style from "./Main.module.css";

interface MainPropsType {
    children?: JSX.Element;
    className?: string;
}

function Main({children, className}: MainPropsType): JSX.Element {
    return (
        <main className={`${style.main} + ${className}`}>{children}</main>
    );
}

export default Main;
