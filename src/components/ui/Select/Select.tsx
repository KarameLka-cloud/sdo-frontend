import React, {JSX} from "react";
import styles from "./Select.module.css";

interface SelectProps {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    data: ItemProps[];
}

interface ItemProps {
    id: number;
    name: string;
}

function Select({name, value, onChange, className, data}: SelectProps): JSX.Element {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`${styles.form_select} ${className}`}
        >
            <option value="" disabled>
                Выбрать из списка
            </option>
            {data.map((item: ItemProps) => (
                <option key={item.id} value={item.id}>
                    {item.name}
                </option>
            ))}
        </select>
    )
}

export default Select;
