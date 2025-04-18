import { JSX } from "react";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import TopServices from "../../../components/Knowledge/TopServices/TopServices";

function Knowledge(): JSX.Element {
  return (
    <>
      <HeaderPage>База знаний</HeaderPage>
      <TopServices href="top" />
    </>
  );
}

export default Knowledge;
