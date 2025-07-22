import {JSX} from "react";
import style from "./ButtonSubmit.module.css";
import {ButtonSubmitType} from "../../../types/components/ButtonSubmitType.ts";

function ButtonSubmit({children, loading, className = ""}: ButtonSubmitType): JSX.Element {
    return (
        <button type="submit"
                className={loading ? `${style.button_submit_loading} + ${className}` : `${style.button_submit} + ${className}`}
                disabled={loading}>
            {loading ? <div className={style.loader}></div> : <div className={style.text}>{children}</div>}
        </button>
    );
}

export default ButtonSubmit;
