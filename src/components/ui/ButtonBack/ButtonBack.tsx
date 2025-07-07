import {JSX} from "react";
import style from "./ButtonBack.module.css";
import {ButtonBackType} from "../../../types/components/ButtonBackType.ts";
import {useNavigate} from "react-router-dom";

function ButtonBack({className = ""}: ButtonBackType): JSX.Element {
    const navigate = useNavigate();

    return (
        <div className={`${style.button_back} + ${className}`} onClick={() => navigate(-1)}>
            <img className={`${style.img_back} + ${className}`} src="/src/assets/images/icons/back.svg" alt="Назад"/>
            Назад
        </div>
    )
}

export default ButtonBack;
