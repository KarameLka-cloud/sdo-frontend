import {JSX, useState} from "react";
import style from "./Events.module.css";
import {EventType} from "../../../../types/components/EventType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import InputText from "../../../../components/ui/InputText/InputText.tsx";
import EventItem from "../../../../components/ui/Event/Event.tsx";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import {
    useGetEdoEventsQuery,
    useAddEdoEventMutation,
    useDeleteEdoEventMutation
} from "../../../../services/store/features/edo.ts";

function Events(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEdoEventsQuery("");
    const [addEdoEvent, {isLoading: addLoading, isError: addError}] = useAddEdoEventMutation();
    const [deleteEdoEvent] = useDeleteEdoEventMutation();

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
            <ButtonBack/>
            <div className={style.form}>
                {addError ? (
                    <>Error</>
                ) : addLoading ? (
                    <>Loading...</>
                ) : null}
                <InputText type="text" name="title" placeholder="Название" value={formData.title}
                           onChange={handleChange} className={style.form_input}/>
                <InputText type="text" name="description" placeholder="Описание" value={formData.description}
                           onChange={handleChange} className={style.form_input}/>
                <InputText type="text" name="department" placeholder="Отделения" value={formData.department}
                           onChange={handleChange} className={style.form_input}/>
                <div className={style.form_date}>
                    <input type="time" name="time" placeholder="Время" value={formData.time} onChange={handleChange}
                           className={style.form_input_time}/>
                    <input type="date" name="date" placeholder="Дата" value={formData.date} onChange={handleChange}
                           className={style.form_input_date}/>
                </div>
                <button onClick={handleAddEdoEvent} className={style.button_create}>Создать</button>
            </div>
            <hr/>
            <div>
                {listError ? (
                    <ErrorData/>
                ) : listLoading ? (
                    <Loader/>
                ) : listData && listData.length > 0 ? (
                    listData.map((item: EventType) => {
                        return (
                            <EventItem key={item.id} event={item} mutation={deleteEdoEvent}/>
                        )
                    })
                ) : <>Мероприятий нет</>
                }
            </div>
        </>
    )
}

export default Events;
