import {JSX} from "react";
import style from "./LinkService.module.css";
import {Link} from "react-router-dom";
import {LinkServiceType} from "../../../types/components/LinkServiceType.ts";

export type LinkServiceProps = {
    link: LinkServiceType;
}

function LinkService({link}: LinkServiceProps): JSX.Element {
    return <Link to={link.path} className={style.link}>{link.title}</Link>

}

export default LinkService;
