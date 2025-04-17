import { JSX } from "react";
import style from "./Info.module.css";

function Info({ className = "" }: { className?: string }): JSX.Element {
  return (
    <div className={`${style.component} + ${className}`}>
      <div className={style.date}>Date</div>
      <div className={style.name}>Привет, Name</div>
      <div className={style.department}>Department</div>
      <div className={style.description}>Description</div>
      <img className={style.img} src="/src/assets/images/my_info.png" alt="" />
    </div>
  );
}

export default Info;
