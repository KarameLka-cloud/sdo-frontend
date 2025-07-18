import {JSX} from "react";
import {NoDataType} from "../../../types/components/NoDataType.ts";
import style from "./NoData.module.css";

function NoData({children, className}: NoDataType): JSX.Element {
    return (
        <div className={`${style.noData} ${className}`}>{`${children} ｡ﾟ･ (>﹏<) ･ﾟ｡`}</div>
    )
}

export default NoData;
