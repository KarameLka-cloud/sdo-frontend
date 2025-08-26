import * as React from "react";
import {JSX} from "react";
import style from "./Events.module.css";
import {EventType} from "../../../../types/components/EventType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import InputDate from "../../../../components/ui/InputDate/InputDate.tsx";
import InputText from "../../../../components/ui/InputText/InputText.tsx";
import InputTime from "../../../../components/ui/InputTime/InputTime.tsx";
import ButtonSubmit from "../../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import EventChange from "../../../../components/ui/EventChange/EventChange.tsx";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import {
    useGetEducationEventsQuery,
    useAddEducationEventMutation,
    useUpdateEducationEventMutation,
    useDeleteEducationEventMutation,
} from "../../../../services/store/features/education.ts";
import {useForm} from "../../../../hooks/useForm.ts";

function Events(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEducationEventsQuery("");
    const [addEvent, {isLoading: addLoading, isError: addError}] = useAddEducationEventMutation();
    const [updateEvent] = useUpdateEducationEventMutation();
    const [deleteEvent] = useDeleteEducationEventMutation();

    const {formItems, setFormItems, handleChange} = useForm({
        title: "",
        description: "",
        department: "",
        time: "",
        date: ""
    });

    const handleAddEdoEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        await addEvent(formItems).unwrap();
        setFormItems({
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
            <form onSubmit={handleAddEdoEvent} className={style.form}>
                <InputText type="text" name="title" placeholder="Название" value={formItems.title}
                           onChange={handleChange} className={style.form_input_text}/>
                <InputText type="text" name="description" placeholder="Описание" value={formItems.description}
                           onChange={handleChange} className={style.form_input_text}/>
                <InputText type="text" name="department" placeholder="Отделения" value={formItems.department}
                           onChange={handleChange} className={style.form_input_text}/>
                <div className={style.form_date}>
                    <InputDate type="date" name="date" placeholder="Дата" value={formItems.date} onChange={handleChange}
                               className={style.form_input_date}/>
                    <InputTime type="time" name="time" placeholder="Время" value={formItems.time}
                               onChange={handleChange}
                               className={style.form_input_time}/>
                </div>
                <ButtonSubmit loading={addLoading} className={style.button_create}>Создать</ButtonSubmit>
            </form>
            {addError && (<div>Error</div>)}
            <hr/>
            <div>
                {listError ? (
                    <ErrorData/>
                ) : listLoading ? (
                    <Loader/>
                ) : listData && listData.length > 0 ? (
                    listData.map((item: EventType) => {
                        return (
                            <EventChange key={item.id} event={item} mutationUpdate={updateEvent}
                                         mutationDelete={deleteEvent}
                                         className={style.event}/>
                        )
                    })
                ) : <>Мероприятий нет</>
                }
            </div>
        </>
    )
}

export default Events;
