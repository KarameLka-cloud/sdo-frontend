import { JSX } from "react";
import style from "./TopServices.module.css";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";

function TopServices(): JSX.Element {
  return (
    <>
      <HeaderPage className={style.header}>ТОП 25</HeaderPage>
      <div>TopServices</div>
    </>
  );
}

export default TopServices;
