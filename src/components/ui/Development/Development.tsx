import {JSX} from "react";
import style from "./Development.module.css";

type DevelopmentProps = {
    className?: string;
}

function Development({className = ""}: DevelopmentProps): JSX.Element {
    return (
        <div className={style.development}>
            <img src="/src/assets/images/development.svg" alt="" className={`${style.image} + ${className}`}/>
        </div>
    )
}

export default Development;
