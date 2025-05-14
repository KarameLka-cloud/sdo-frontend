import {JSX} from "react";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import Development from "../../../components/ui/Development/Development.tsx";

function Education(): JSX.Element {
    return (
        <>
            <HeaderPage>Мое обучение</HeaderPage>

            <Development/>
        </>
    );
}

export default Education;
