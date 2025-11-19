import {JSX} from "react";
import styles from "./Switch.module.css";

function Switch({title, value, mutation, className}: {
    title?: string;
    value: boolean;
    mutation?: () => void;
    className?: string;
}): JSX.Element {
    return (
        <label className={`${styles.switch} ${className}`}>
            <span>{title}</span>
            <input type="checkbox" checked={value} onChange={mutation}/>
            <span className={styles.track} aria-hidden="true"></span>
        </label>
    )
}

export default Switch;
