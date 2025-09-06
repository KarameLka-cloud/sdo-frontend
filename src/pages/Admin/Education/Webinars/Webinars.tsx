import React from "react";
import {JSX} from "react";
import style from "./Webinars.module.css";
import {WebinarType} from "../../../../interfaces/api/WebinarType.ts";
import WebinarChange from "../../../../components/ui/WebinarChange/WebinarChange.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import InputDate from "../../../../components/ui/InputDate/InputDate.tsx";
import InputText from "../../../../components/ui/InputText/InputText.tsx";
import InputTime from "../../../../components/ui/InputTime/InputTime.tsx";
import ButtonSubmit from "../../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import {
    useGetEducationWebinarsQuery,
    useAddEducationWebinarMutation,
    useUpdateEducationWebinarMutation,
    useDeleteEducationWebinarMutation,
} from "../../../../services/store/features/education.ts";
import {useForm} from "../../../../hooks/useForm.ts";

function Webinars(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEducationWebinarsQuery("");
    const [addWebinar, {isLoading: addLoading, isError: addError}] = useAddEducationWebinarMutation();
    const [updateWebinar] = useUpdateEducationWebinarMutation();
    const [deleteWebinar] = useDeleteEducationWebinarMutation();

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
        <>
            <ButtonBack/>
            <form onSubmit={handleAction} className={style.form}>
                <InputText type="text" name="title" placeholder="Название" value={formItems.title}
                           onChange={handleChange} className={style.form_input_text}/>
                <div className={style.form_date}>
                    <InputDate type="date" name="date" placeholder="Дата" value={formItems.date} onChange={handleChange}
                               className={style.form_input_date}/>
                    <InputTime type="time" name="time_start" placeholder="Время начала" value={formItems.time_start}
                               onChange={handleChange}
                               className={style.form_input_time}/>
                    <InputTime type="time" name="time_end" placeholder="Время окончания" value={formItems.time_end}
                               onChange={handleChange}
                               className={style.form_input_time}/>
                </div>
                <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
            </form>
            {addError && (<div>Error</div>)}
            <hr/>
            <div>
                {listError ? (
                    <ErrorData/>
                ) : listLoading ? (
                    <Loader/>
                ) : listData && listData.length > 0 ? (
                    listData.map((item: WebinarType) => {
                        return (
                            <WebinarChange key={item.id} webinar={item} mutationUpdate={updateWebinar}
                                           mutationDelete={deleteWebinar}
                                           className={style.webinar}/>
                        )
                    })
                ) : <>Мероприятий нет</>
                }
            </div>
        </>
    )
}

export default Webinars;
