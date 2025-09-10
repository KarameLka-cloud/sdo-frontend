import {JSX} from "react";
import HeaderPage from "@components/ui/HeaderPage/HeaderPage.tsx";
import Development from "@components/ui/Development/Development.tsx";

function Knowledge(): JSX.Element {
    return (
        <>
            <HeaderPage>База знаний</HeaderPage>

            <Development/>
        </>
    )
}

export default Knowledge;
