import {JSX} from "react";
import style from "./NoData.module.css";

interface NoDataType {
    children: string,
    className?: string,
}

function NoData({children, className}: NoDataType): JSX.Element {
    return (
        <div className={`${style.noData} ${className}`}>{`${children} ｡ﾟ･ (>﹏<) ･ﾟ｡`}</div>
    )
}

export default NoData;
