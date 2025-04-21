import { JSX } from "react";
import style from "./Info.module.css";

function Info({
  className = "",
  date = "",
  name = "",
  department = "",
  description = "",
}: {
  className?: string;
  date?: string;
  name?: string;
  department?: string;
  description?: string;
}): JSX.Element {
  return (
    <div className={`${style.component} + ${className}`}>
      <div className={style.date}>{date}</div>
      <div className={style.name}>Привет, {name}</div>
      <div className={style.department}>{department}</div>
      <div className={style.description}>{description}</div>
      <img className={style.img} src="/src/assets/images/my_info.png" alt="" />
    </div>
  );
}

export default Info;
