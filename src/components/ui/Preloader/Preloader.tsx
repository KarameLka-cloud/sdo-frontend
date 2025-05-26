import {JSX} from "react";
import style from "./Preloader.module.css";
import {PreloaderType} from "../../../types/components/PreloaderType.ts";

function Preloader({className = ""}: PreloaderType): JSX.Element {
    return (
        <div className={`${style.preloader} + ${className}`}>
            <img src="" alt=""/>
        </div>
    );
}

export default Preloader;
