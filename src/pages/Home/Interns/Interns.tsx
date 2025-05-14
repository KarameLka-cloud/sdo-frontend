import {JSX} from "react";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import Development from "../../../components/ui/Development/Development.tsx";

function Interns(): JSX.Element {
    return (
        <>
            <HeaderPage>Мои стажеры</HeaderPage>

            <Development/>
        </>
    );
}

export default Interns;
