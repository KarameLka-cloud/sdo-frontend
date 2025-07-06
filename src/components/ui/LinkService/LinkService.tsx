import {JSX} from "react";
import style from "./LinkService.module.css";
import {Link} from "react-router-dom";
import {LinkServiceType} from "../../../types/components/LinkServiceType.ts";

export type LinkServiceProps = {
    item: LinkServiceType;
}

function LinkService({item}: LinkServiceProps): JSX.Element {
    return <Link to={item.path} className={style.link}>{item.title}</Link>

}

export default LinkService;
