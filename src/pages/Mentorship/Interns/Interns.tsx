import { JSX } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Interns(): JSX.Element {
  return (
    <OverflowScrollBlock header_name={"Список стажеров"}>
      <h2>Список стажеров</h2>
      <p>
        Здесь будет отображаться список стажеров, возможно с фильтрами и
        поиском.
      </p>
    </OverflowScrollBlock>
  );
}

export default Interns;
