import React, {JSX} from "react";
import styles from "./Events.module.css";
import {EventType} from "@interfaces/api/EventType.ts";
import ButtonBack from "@components/ui/ButtonBack/ButtonBack.tsx";
import Input from "@components/ui/Input/Input.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import EventChange from "@components/ui/EventChange/EventChange.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";
import {useForm} from "@hooks/useForm.ts";
import {
    useGetEducationEventsQuery,
    useAddEducationEventMutation,
    useUpdateEducationEventMutation,
    useDeleteEducationEventMutation,
} from "@services/store/features/education.ts";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEducationEventsQuery("");
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

    const handleAction = async (e: React.FormEvent) => {
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
            <form onSubmit={handleAction} className={styles.form}>
                <Input type="text" name="title" placeholder="Название" value={formItems.title}
                       onChange={handleChange} className={styles.form_input_text}/>
                <Input type="text" name="description" placeholder="Описание" value={formItems.description}
                       onChange={handleChange} className={styles.form_input_text}/>
                <Input type="text" name="department" placeholder="Отделения" value={formItems.department}
                       onChange={handleChange} className={styles.form_input_text}/>
                <div className={styles.form_date}>
                    <Input type="date" name="date" placeholder="Дата" value={formItems.date} onChange={handleChange}
                           className={styles.form_input_date}/>
                    <Input type="time" name="time" placeholder="Время" value={formItems.time}
                           onChange={handleChange}
                           className={styles.form_input_time}/>
                </div>
                <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
            </form>
            {addError && (<div>Error</div>)}
            <hr/>
            <DataList<EventType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: EventType) => (
                    <EventChange key={item.id} event={item} mutationUpdate={updateEvent}
                                 mutationDelete={deleteEvent}
                                 className={styles.event}/>
                )}
            />
        </>
    )
}

export default Events;
