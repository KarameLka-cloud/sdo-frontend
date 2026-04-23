import { JSX } from "react";
import styles from "./LinkService.module.css";
import { Link } from "react-router-dom";

export interface LinkServiceType {
  link: {
    id: number;
    title: string;
    path: string;
  };
}

function LinkService({ link }: LinkServiceType): JSX.Element {
  return (
    <Link to={link.path} className={styles.link}>
      {link.title}
    </Link>
  );
}

export default LinkService;
