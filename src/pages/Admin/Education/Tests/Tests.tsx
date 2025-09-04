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
    useGetEducationTestsQuery,
    useAddEducationTestMutation,
    useUpdateEducationTestMutation,
    useDeleteEducationTestMutation,
} from "../../../../services/store/features/education.ts";
import {useForm} from "../../../../hooks/useForm.ts";

function Tests(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEducationTestsQuery("");
    const [addTest, {isLoading: addLoading, isError: addError}] = useAddEducationTestMutation();
    const [updateTest] = useUpdateEducationTestMutation();
    const [deleteTest] = useDeleteEducationTestMutation();

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
                <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
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
