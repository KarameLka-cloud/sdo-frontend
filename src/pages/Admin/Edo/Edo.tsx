import {JSX} from "react";
import styles from "./Edo.module.css";
import LinkService from "@components/ui/LinkService/LinkService.tsx";
import {ADMIN_NAV_EDO_LINKS} from "@constants/navigation.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Edo(): JSX.Element {
    return (
        <OverflowScrollBlock header_name={'Единый день обучения'}>
            <div className={styles.links}>
                {ADMIN_NAV_EDO_LINKS.map((link) => (
                    <LinkService key={link.id} link={link}/>
                ))}
            </div>
        </OverflowScrollBlock>
    )
}

export default Edo;
