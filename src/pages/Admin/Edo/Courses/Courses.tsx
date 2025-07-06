import {JSX, useState} from "react";
import style from "../Events/Events.module.css";
import InputText from "../../../../components/ui/InputText/InputText.tsx";

function Courses(): JSX.Element {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: "",
        date: ""
    });

    const handleChange = (e: {
        target: { name: string; value: string };
    }): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    return (
        <>
            <div className={style.form}>
                {/*{addError ? (<>Error</>) : addLoading ? (<>Loading...</>) : null}*/}
                <InputText type="text" name="title" placeholder="Название" value={formData.title}
                           onChange={handleChange} className={style.form_input}/>
                <InputText type="text" name="description" placeholder="Описание" value={formData.description}
                           onChange={handleChange} className={style.form_input}/>
                <InputText type="text" name="department" placeholder="Отделения" value={formData.department}
                           onChange={handleChange} className={style.form_input}/>
                <input type="date" name="date" placeholder="Дата" value={formData.date} onChange={handleChange}
                       className={style.form_input_date}/>
                {/*<button onClick={handleAddEdoEvent} className={style.button_create}>Создать</button>*/}
            </div>
            <hr/>
        </>
    )
}

export default Courses;
