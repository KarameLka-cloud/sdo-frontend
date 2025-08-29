import {JSX} from "react";
import style from "./LinkService.module.css";
import {Link} from "react-router-dom";

export type LinkServiceType = {
    link: {
        id: number;
        title: string;
        path: string;
    }
}

function LinkService({link}: LinkServiceType): JSX.Element {
    return <Link to={link.path} className={style.link}>{link.title}</Link>

}

export default LinkService;
