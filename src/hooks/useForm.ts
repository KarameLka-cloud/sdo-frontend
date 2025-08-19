import {useState, ChangeEvent} from "react";

type FormValues<T> = {
    [K in keyof T]: string;
};

export function useForm<T extends Record<string, any>>(initialValues: FormValues<T>) {
    const [formItems, setFormItems] = useState<FormValues<T>>(initialValues);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormItems(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    return {formItems, setFormItems, handleChange};
}
