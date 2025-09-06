import {JSX} from "react";
import style from "./HeaderPage.module.css";
import {ReactNode} from "react";

interface HeaderPageType {
    children: ReactNode
    className?: string;
}

function HeaderPage({children, className}: HeaderPageType): JSX.Element {
    return <h2 className={`${style.header_page} + ${className}`}>{children}</h2>;
}

export default HeaderPage;
