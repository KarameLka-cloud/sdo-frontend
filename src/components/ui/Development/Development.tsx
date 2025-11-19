import {JSX} from "react";
import styles from "./Development.module.css";
import image_development from "@assets/images/development.svg";

interface DevelopmentType {
    className?: string;
}

function Development({className}: DevelopmentType): JSX.Element {
    return (
        <div>
            <img src={image_development} alt="В разработке" className={`${styles.development} + ${className}`}/>
        </div>
    )
}

export default Development;
