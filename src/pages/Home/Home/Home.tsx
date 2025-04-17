import { JSX } from "react";
import style from "./Home.module.css";
import Info from "../../../components/home/Info/Info.tsx";

function Home(): JSX.Element {
  return (
    <>
      <Info className={style.info} />
    </>
  );
}

export default Home;
