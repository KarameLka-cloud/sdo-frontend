import React, {JSX, useState} from "react";
import styles from "./Events.module.css";
import {EventType} from "@interfaces/api/EventType.ts";
import Input from "@components/ui/Input/Input.tsx";
import Select from "@components/ui/Select/Select.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import EventChange from "@components/ui/EventChange/EventChange.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";
import {useForm} from "@hooks/useForm.ts";
import {
    useGetEdoEventsQuery,
    useAddEdoEventMutation,
    // useUpdateEdoEventMutation,
    useDeleteEdoEventMutation,
} from "@services/store/features/edo.ts";
import {
    useGetDepartmentsQuery
} from "@services/store/features/user.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import {useToggle} from "@hooks/useToggle.ts";
import {useFiltered} from "@hooks/useFiltered.ts";

function Events(): JSX.Element {
    const {value: formShow, toggle: handleFormShow} = useToggle();
    const {data, error, isLoading} = useGetEdoEventsQuery("");
    const [addEvent, {isLoading: addLoading, isError: addError}] = useAddEdoEventMutation();
    // const [updateEvent] = useUpdateEdoEventMutation();
    const [deleteEvent] = useDeleteEdoEventMutation();
    const {data: departments} = useGetDepartmentsQuery("");
    const [search, setSearch] = useState("");
    const filteredData = useFiltered<EventType>(data, search);

    const {formItems, setFormItems, handleChange} = useForm({
        title: "",
        description: "",
        link: "",
        department_id: "1",
        note_department: "",
        time: "",
        date: ""
    });

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        await addEvent(formItems).unwrap();
        setFormItems({
            title: "",
            description: "",
            link: "",
            department_id: "1",
            note_department: "",
            time: "",
            date: ""
        });
    };

    return (
        <OverflowScrollBlock header_name={'Редактирование мероприятий'} button_back_visible={'enable'}>
            <div className={styles.create_search}>
                {formShow ? <IconButton type={'close'} onClick={handleFormShow}/> :
                    <IconButton type={'edit'} onClick={handleFormShow}/>}
                <Input type={"text"} name={"search"} placeholder={'🔎'} className={styles.input_search}
                       value={search}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearch(e.target.value)}/>
            </div>
            {formShow ?
                <>
                    <form onSubmit={handleAction} className={styles.form}>
                        <Input type="text" name="title" placeholder="Название" value={formItems.title}
                               onChange={handleChange} className={styles.form_input_text}/>
                        <Input type="text" name="description" placeholder="Описание" value={formItems.description}
                               onChange={handleChange} className={styles.form_input_text}/>
                        <Input type="text" name="link" placeholder="Ссылка на доп. материалы (опционально)"
                               value={formItems.link}
                               onChange={handleChange} className={styles.form_input_text}/>
                        <div className={styles.form_department}>
                            {departments &&
                                <Select name={"department_id"} value={formItems.department_id} onChange={handleChange}
                                        data={departments} className={styles.form_select}/>
                            }
                            <Input type="text" name="note_department" placeholder="Примечание по отделу (опционально)"
                                   value={formItems.note_department}
                                   onChange={handleChange} className={styles.form_note_department}/>
                        </div>
                        <div className={styles.form_date}>
                            <Input type="date" name="date" placeholder="Дата" value={formItems.date}
                                   onChange={handleChange}
                                   className={styles.form_input_date}/>
                            <Input type="time" name="time" placeholder="Время" value={formItems.time}
                                   onChange={handleChange}
                                   className={styles.form_input_time}/>
                            <span className={styles.explanation}>&nbsp;Время (опционально)</span>
                        </div>
                        <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
                    </form>
                    <div>{addError && (`Error`)}</div>
                    <hr/>
                </> : null
            }

            <DataList<EventType>
                data={filteredData}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: EventType) => (
                    <EventChange
                        key={item.id}
                        event={item}
                        mutationDelete={deleteEvent}
                        className={styles.event}
                    />
                )}
            />
        </OverflowScrollBlock>
    )
}

export default Events;
