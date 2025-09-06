import {JSX} from "react";
import styles from "./IconButton.module.css";
import icon_edit from "../../../assets/images/icons/pencil.svg";
import icon_delete from "../../../assets/images/icons/trash.svg";
import icon_save from "../../../assets/images/icons/save.svg";
import icon_close from "../../../assets/images/icons/close.svg";

interface IconButtonProps {
    type: "edit" | "delete" | "save" | "close";
    onClick?: () => void;
    className?: string;
}

function IconButton({type, onClick, className}: IconButtonProps): JSX.Element {
    const types = {
        edit: {
            src: icon_edit,
            style: styles.edit,
            alt: "Кнопка редактировать"
        },
        delete: {
            src: icon_delete,
            style: styles.delete,
            alt: "Кнопка удалить"
        },
        save: {
            src: icon_save,
            style: styles.save,
            alt: "Кнопка сохранить"
        },
        close: {
            src: icon_close,
            style: styles.close,
            alt: "Кнопка закрыть"
        }
    }

    const {src, style, alt} = types[type];

    return (
        <div className={`${styles.button} ${className} ${style}`} onClick={onClick}>
            <img src={src} alt={alt}/>
        </div>
    )
}

export default IconButton;
