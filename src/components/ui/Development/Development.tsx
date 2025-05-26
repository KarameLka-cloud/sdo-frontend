import {JSX} from "react";
import style from "./Development.module.css";
import {DevelopmentType} from "../../../types/components/DevelopmentType.ts";

function Development({className = ""}: DevelopmentType): JSX.Element {
    return (
        <img src="/src/assets/images/development.svg" alt="" className={`${style.development} + ${className}`}/>
    );
}

export default Development;
