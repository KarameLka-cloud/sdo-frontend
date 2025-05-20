import {JSX} from "react";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import Development from "../../../components/ui/Development/Development.tsx";

function Career(): JSX.Element {
    return (
        <>
            <HeaderPage>Карьера</HeaderPage>

            <Development/>
        </>
    );
}

export default Career;
