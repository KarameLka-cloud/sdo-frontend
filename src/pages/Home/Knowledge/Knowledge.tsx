import { JSX } from "react";
import { Link } from "react-router-dom";
import style from "./Knowledge.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";

function Knowledge(): JSX.Element {
  return (
    <>
      <HeaderPage>База знаний</HeaderPage>
      <div className={style.top_component}>
        <div className={style.top_title}>
          Услуги, изучаемых в период адаптации
        </div>
        <Link to="top" className={style.top_link}>
          ТОП 25
        </Link>
      </div>
    </>
  );
}

export default Knowledge;
