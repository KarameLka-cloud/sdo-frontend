import React from "react";
import {JSX} from "react";
import style from "./Tests.module.css";
import {TestType} from "../../../../types/api/TestType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import InputDate from "../../../../components/ui/InputDate/InputDate.tsx";
import InputText from "../../../../components/ui/InputText/InputText.tsx";
import ButtonSubmit from "../../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import TestChange from "../../../../components/ui/TestChange/TestChange.tsx";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import {
    useGetEdoTestsQuery,
    useAddEdoTestMutation,
    useDeleteEdoTestMutation, useUpdateEdoTestMutation
} from "../../../../services/store/features/edo.ts";
import {useForm} from "../../../../hooks/useForm.ts";

function Tests(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEdoTestsQuery("");
    const [addTest, {isLoading: addLoading, isError: addError}] = useAddEdoTestMutation();
    const [updateTest] = useUpdateEdoTestMutation();
    const [deleteTest] = useDeleteEdoTestMutation();

    const {formItems, setFormItems, handleChange} = useForm({
        title: "",
        url: "",
        date_end: ""
    });

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        await addTest(formItems).unwrap();
        setFormItems({
            title: "",
            url: "",
            date_end: ""
        })
    }

    return (
        <>
            <ButtonBack/>
            <form onSubmit={handleAction} className={style.form}>
                <InputText type="text" name="title" placeholder="Название" value={formItems.title}
                           onChange={handleChange} className={style.form_input_text}/>
                <InputText type="text" name="url" placeholder="Ссылка на тест" value={formItems.url}
                           onChange={handleChange} className={style.form_input_text}/>
                <InputDate type="date" name="date_end" placeholder="Пройти до" value={formItems.date_end}
                           onChange={handleChange}
                           className={style.form_input_date_end}/>
                <ButtonSubmit loading={addLoading} className={style.button_create}>Создать</ButtonSubmit>
            </form>
            {addError && (<div>Error</div>)}
            <hr/>
            {listError ? (
                <ErrorData/>
            ) : listLoading ? (
                <Loader/>
            ) : listData && listData.length > 0 ? (
                listData.map((item: TestType) => {
                    return (
                        <TestChange key={item.id} test={item} mutationUpdate={updateTest}
                                    mutationDelete={deleteTest}
                                    className={style.test}/>
                    )
                })
            ) : <>Тестов нет</>
            }
        </>
    )
}

export default Tests;
