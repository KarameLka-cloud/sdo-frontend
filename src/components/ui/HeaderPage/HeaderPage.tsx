import {JSX} from "react";
import style from "./HeaderPage.module.css";

type HeaderPageProps = {
    children: string;
    className?: string;
}

function HeaderPage({children, className = ""}: HeaderPageProps): JSX.Element {
    return <h2 className={`${style.component} + ${className}`}>{children}</h2>;
}

export default HeaderPage;
