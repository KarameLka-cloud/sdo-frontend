import { JSX } from "react";
import styles from "./IconButton.module.css";
import editIcon from "@assets/images/icons/pencil.svg";
import deleteIcon from "@assets/images/icons/trash.svg";
import saveIcon from "@assets/images/icons/save.svg";
import closeIcon from "@assets/images/icons/close.svg";

interface IconButtonProps {
  type: "edit" | "delete" | "save" | "close";
  onClick?: () => void;
  className?: string;
}

function IconButton({
  type,
  onClick,
  className,
}: IconButtonProps): JSX.Element {
  const types = {
    edit: {
      src: editIcon,
      style: styles.edit,
      alt: "Кнопка редактировать",
    },
    delete: {
      src: deleteIcon,
      style: styles.delete,
      alt: "Кнопка удалить",
    },
    save: {
      src: saveIcon,
      style: styles.save,
      alt: "Кнопка сохранить",
    },
    close: {
      src: closeIcon,
      style: styles.close,
      alt: "Кнопка закрыть",
    },
  };

  const { src, style, alt } = types[type];

  return (
    <div className={`${styles.button} ${className} ${style}`} onClick={onClick}>
      <img src={src} alt={alt} />
    </div>
  );
}

export default IconButton;
