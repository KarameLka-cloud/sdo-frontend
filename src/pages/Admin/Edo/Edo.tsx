import {JSX, useState} from "react";
import {Link} from "react-router-dom";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import {useAddEdoEventMutation} from "../../../services/store/features/edoApi.ts";

function Edo(): JSX.Element {
    const [addEdoEvent, {isLoading, isError}] = useAddEdoEventMutation();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: "",
        time: "",
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

    const handleAddEdoEvent = async () => {
        await addEdoEvent(formData).unwrap();
        setFormData({
            title: "",
            description: "",
            department: "",
            time: "",
            date: ""
        });
    };

    return (
        <>
            <HeaderPage>Единый день обучения</HeaderPage>
            <div>
                <Link to="courses">courses</Link>
                <br/>
                <Link to="events">events</Link>
                <br/>
                <Link to="tests">tests</Link>
                <br/>
            </div>

            {isError ? (<>Error</>) : isLoading ? (<>Loading...</>) : null}
            <input type="text" name="title" placeholder="Название" value={formData.title} onChange={handleChange}/>
            <br/>
            <input type="text" name="description" placeholder="Описание" value={formData.description}
                   onChange={handleChange}/>
            <br/>
            <input type="text" name="department" placeholder="Отделения" value={formData.department}
                   onChange={handleChange}/>
            <br/>
            <input type="time" name="time" placeholder="Время" value={formData.time} onChange={handleChange}/>
            <br/>
            <input type="date" name="date" placeholder="Дата" value={formData.date} onChange={handleChange}/>
            <br/>
            <button onClick={handleAddEdoEvent}>Создать</button>
        </>
    )
}

export default Edo;
