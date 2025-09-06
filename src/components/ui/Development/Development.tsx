import {JSX} from "react";
import style from "./Development.module.css";
import image_development from "../../../assets/images/development.svg";

interface DevelopmentType {
    className?: string;
}

function Development({className}: DevelopmentType): JSX.Element {
    return (
        <img src={image_development} alt="В разработке" className={`${style.development} + ${className}`}/>
    )
}

export default Development;
