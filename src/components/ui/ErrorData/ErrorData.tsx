import {JSX} from "react";
import style from "./ErrorData.module.css";

type ErrorDataType = {
    className?: string;
}

function ErrorData({className}: ErrorDataType): JSX.Element {
    return (
        <div className={`${style.errorData} ${className}`}>Ошибка получения данных (•ิ_•ิ)</div>
    )
}

export default ErrorData;
