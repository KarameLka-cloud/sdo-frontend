import {JSX} from "react";
import style from "./ButtonBack.module.css";
import icon_back from "../../../assets/images/icons/back.svg";
import {useNavigate} from "react-router-dom";

type ButtonBackType = {
    className?: string;
}

function ButtonBack({className = ""}: ButtonBackType): JSX.Element {
    const navigate = useNavigate();

    return (
        <div className={`${style.button_back} + ${className}`} onClick={() => navigate(-1)}>
            <img className={style.img_back} src={icon_back} alt="Назад"/>
            Назад
        </div>
    )
}

export default ButtonBack;
