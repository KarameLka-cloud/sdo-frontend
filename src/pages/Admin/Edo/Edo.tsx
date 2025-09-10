import {JSX} from "react";
import style from "./Edo.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import LinkService from "../../../components/ui/LinkService/LinkService.tsx";
import {ADMIN_NAV_EDO_LINKS} from "../../../constants/navigation.ts";

function Edo(): JSX.Element {
    return (
        <>
            <HeaderPage>Единый день обучения</HeaderPage>
            <div className={style.links}>
                {ADMIN_NAV_EDO_LINKS.map((link) => (
                    <LinkService key={link.id} link={link}/>
                ))}
            </div>
        </>
    )
}

export default Edo;
