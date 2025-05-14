import {JSX} from "react";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import Development from "../../../components/ui/Development/Development.tsx";

function Achievements(): JSX.Element {
    return (
        <>
            <HeaderPage>Мои достижения</HeaderPage>

            <Development/>
        </>
    );
}

export default Achievements;
