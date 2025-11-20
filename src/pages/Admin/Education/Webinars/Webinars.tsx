import React, {JSX, useState} from "react";
import styles from "./Webinars.module.css";
import {WebinarType} from "@interfaces/api/WebinarType.ts";
import Input from "@components/ui/Input/Input.tsx";
import WebinarChange from "@components/ui/WebinarChange/WebinarChange.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";
import {useForm} from "@hooks/useForm.ts";
import {
    useGetEducationWebinarsQuery,
    useAddEducationWebinarMutation,
    // useUpdateEducationWebinarMutation,
    useDeleteEducationWebinarMutation,
} from "@services/store/features/education.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import {useFiltered} from "@hooks/useFiltered.ts";
import {useToggle} from "@hooks/useToggle.ts";

function Webinars(): JSX.Element {
    const {value: formShow, toggle: handleFormShow} = useToggle();
    const {data, error, isLoading} = useGetEducationWebinarsQuery("");
    const [addWebinar, {isLoading: addLoading, isError: addError}] = useAddEducationWebinarMutation();
    // const [updateWebinar] = useUpdateEducationWebinarMutation();
    const [deleteWebinar] = useDeleteEducationWebinarMutation();
    const [search, setSearch] = useState("");
    const filteredData = useFiltered<WebinarType>(data, search);

    const {formItems, setFormItems, handleChange} = useForm({
        title: "",
        time_start: "",
        time_end: "",
        date: "",
    });

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        await addWebinar(formItems).unwrap();
        setFormItems({
            title: "",
            time_start: "",
            time_end: "",
            date: "",
        });
    };

    return (
        <OverflowScrollBlock header_name={'Редактирование вебинаров'} button_back_visible={'enable'}>
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
                        <div className={styles.form_date}>
                            <Input type="date" name="date" placeholder="Дата" value={formItems.date}
                                   onChange={handleChange}
                                   className={styles.form_input_date}/>
                            <Input type="time" name="time_start" placeholder="Время начала" value={formItems.time_start}
                                   onChange={handleChange}
                                   className={styles.form_input_time}/>
                            <Input type="time" name="time_end" placeholder="Время окончания" value={formItems.time_end}
                                   onChange={handleChange}
                                   className={styles.form_input_time}/>
                        </div>
                        <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
                    </form>
                    {addError && (<div>Error</div>)}
                    <hr/>
                </> : null
            }
            <DataList<WebinarType>
                data={filteredData}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: WebinarType) => (
                    <WebinarChange
                        key={item.id} webinar={item}
                        mutationDelete={deleteWebinar}
                        className={styles.webinar}
                    />
                )}
            />
        </OverflowScrollBlock>
    )
}

export default Webinars;
