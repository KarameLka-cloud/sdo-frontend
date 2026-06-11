import { JSX } from "react";
import editIcon from "@/assets/images/icons/pencil.svg";
import deleteIcon from "@/assets/images/icons/trash.svg";
import saveIcon from "@/assets/images/icons/save.svg";
import closeIcon from "@/assets/images/icons/close.svg";

interface IconButtonProps {
  type: "edit" | "delete" | "save" | "close";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

function IconButton({
  type,
  onClick,
  className,
  disabled,
}: IconButtonProps): JSX.Element {
  const types = {
    edit: {
      src: editIcon,
      bgClass: "bg-blue-600 hover:bg-teal-700",
      alt: "Кнопка редактировать",
    },
    delete: {
      src: deleteIcon,
      bgClass: "bg-red-600 hover:bg-red-800",
      alt: "Кнопка удалить",
    },
    save: {
      src: saveIcon,
      bgClass: "bg-green-600 hover:bg-green-800",
      alt: "Кнопка сохранить",
    },
    close: {
      src: closeIcon,
      bgClass: "bg-red-600 hover:bg-red-800",
      alt: "Кнопка закрыть",
    },
  };

  const { src, bgClass, alt } = types[type];

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center
        h-8 w-8 p-0.5
        cursor-pointer border-0 rounded-md
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${bgClass}
        ${className || ""}
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={alt}
    >
      <img src={src} alt={alt} className="w-full h-full" />
    </button>
  );
}

export default IconButton;
