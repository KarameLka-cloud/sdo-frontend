import {JSX} from "react";
import Development from "@components/ui/Development/Development.tsx";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Career(): JSX.Element {
    return (
        <OverflowScrollBlock header_name={'Карьера'}>
            <Development/>
        </OverflowScrollBlock>
    );
}

export default Career;
