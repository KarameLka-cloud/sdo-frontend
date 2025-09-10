import {JSX} from "react";
import styles from "./DataMessage.module.css";

interface DataMessageProps {
    type: "noData" | "error";
    className?: string;
}

function DataMessage({type, className}: DataMessageProps): JSX.Element {
    const types = {
        noData: {
            message: "Список пуст (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
        },
        error: {
            message: "Ошибка получения данных Σ(▼□▼メ)",
        },
    }

    const {message} = types[type];

    return (
        <div className={`${styles.message} ${className}`}>{message}</div>
    )
}

export default DataMessage;
