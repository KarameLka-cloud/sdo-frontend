import { JSX } from "react";
import styles from "./ButtonSeeAll.module.css";
import { Link } from "react-router-dom";

interface ButtonSeeAllType {
  to: string;
}

function ButtonSeeAll({ to }: ButtonSeeAllType): JSX.Element {
  return (
    <Link to={to} className={styles.link}>
      Показать всё
    </Link>
  );
}

export default ButtonSeeAll;
