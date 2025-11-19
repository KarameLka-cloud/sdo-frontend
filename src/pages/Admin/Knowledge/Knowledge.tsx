import {JSX} from "react";
import Development from "@components/ui/Development/Development.tsx";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Knowledge(): JSX.Element {
    return (
        <OverflowScrollBlock header_name={'База знаний'}>
            <Development/>
        </OverflowScrollBlock>
    )
}

export default Knowledge;
