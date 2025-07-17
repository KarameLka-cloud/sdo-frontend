import {JSX} from "react";
import style from "./LoaderImage.module.css";
import image_loading from "../../../assets/images/loading.gif";

function LoaderImage(): JSX.Element {
    return (
        <img src={image_loading} alt="Загрузка" className={style.loader}/>
    )
}

export default LoaderImage;
