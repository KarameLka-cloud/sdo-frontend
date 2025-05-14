import {JSX} from "react";
import style from "./Preloader.module.css";

type PreloaderProps = {
    className: string;
}

function Preloader({className = ""}: PreloaderProps): JSX.Element {
    return (
        <div className={`${style.component} + ${className}`}>
            <img src="" alt=""/>
        </div>
    )
}

export default Preloader;
