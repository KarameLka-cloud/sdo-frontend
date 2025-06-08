import {JSX, useState} from "react";
import {useAddEdoEventMutation} from "../../../../services/store/features/edoApi.ts";

function Events(): JSX.Element {
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
            <div>Edit events page</div>
            <div>
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
            </div>
        </>
    )
}

export default Events;
