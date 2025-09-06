import {JSX} from "react";
import style from "./Webinar.module.css";
import convertDate from "../../../utils/convertDate.ts";
import {WebinarType} from "../../../interfaces/api/WebinarType.ts";
import {convertTime} from "../../../utils/convertTime.ts";

interface EventPropsType {
    className?: string;
    webinar: WebinarType;
}

function Webinar({className, webinar}: EventPropsType): JSX.Element {
    return (
        <div className={`${style.webinar} + ${className}`}>
            <div>
                <span className={style.title}>{webinar.title}</span>
            </div>
            <div className={style.time}>
                <div
                    style={{textAlign: "center"}}>{convertTime(webinar.time_start)}-{convertTime(webinar.time_end)}</div>
                <div style={{textAlign: "center"}}>{convertDate(webinar.date)}</div>
            </div>
        </div>
    );
}

export default Webinar;
