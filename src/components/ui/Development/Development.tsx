import {JSX} from "react";
import style from "./Development.module.css";
import image_development from "../../../assets/images/development.svg";
import {DevelopmentType} from "../../../types/components/DevelopmentType.ts";

function Development({className = ""}: DevelopmentType): JSX.Element {
    return (
        <img src={image_development} alt="" className={`${style.development} + ${className}`}/>
    )
}

export default Development;
