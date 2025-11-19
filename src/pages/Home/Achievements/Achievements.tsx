import {JSX} from "react";
import Development from "@components/ui/Development/Development.tsx";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Achievements(): JSX.Element {
    return (
        <OverflowScrollBlock header_name={'Достижения'}>
            <Development/>
        </OverflowScrollBlock>
    );
}

export default Achievements;
