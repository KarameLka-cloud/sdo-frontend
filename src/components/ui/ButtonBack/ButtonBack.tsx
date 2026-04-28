import { JSX } from "react";
import styles from "./ButtonBack.module.css";
import icon_back from "@assets/images/icons/back.svg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes.ts";

interface ButtonBackType {
  className?: string;
  // fallbackRoute?: keyof typeof ROUTES;
}

function ButtonBack({
  className,
  // fallbackRoute = 'HOME'
}: ButtonBackType): JSX.Element {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // navigate(ROUTES[fallbackRoute]);
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div
      className={`${styles.button_back} ${className ?? ""}`}
      onClick={handleBack}
    >
      <img className={styles.img_back} src={icon_back} alt="Назад" />
      Назад
    </div>
  );
}

export default ButtonBack;
