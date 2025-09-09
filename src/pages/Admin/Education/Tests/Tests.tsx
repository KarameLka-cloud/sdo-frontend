import React, {JSX} from "react";
import style from "./Tests.module.css";
import {TestType} from "../../../../interfaces/api/TestType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import Input from "../../../../components/ui/Input/Input.tsx";
import ButtonSubmit from "../../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import TestChange from "../../../../components/ui/TestChange/TestChange.tsx";
import DataList from "../../../../components/ui/DataList/DataList.tsx";
import {useForm} from "../../../../hooks/useForm.ts";
import {
    useGetEducationTestsQuery,
    useAddEducationTestMutation,
    useUpdateEducationTestMutation,
    useDeleteEducationTestMutation,
} from "../../../../services/store/features/education.ts";

function Tests(): JSX.Element {
    const {data, error, isLoading} = useGetEducationTestsQuery("");
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
                <Input type="text" name="title" placeholder="Название" value={formItems.title}
                       onChange={handleChange} className={style.form_input_text}/>
                <Input type="text" name="url" placeholder="Ссылка на тест" value={formItems.url}
                       onChange={handleChange} className={style.form_input_text}/>
                <Input type="date" name="date_end" placeholder="Пройти до" value={formItems.date_end}
                       onChange={handleChange}
                       className={style.form_input_date_end}/>
                <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
            </form>
            {addError && (<div>Error</div>)}
            <hr/>
            <DataList<TestType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: TestType) => (
                    <TestChange key={item.id} test={item} mutationUpdate={updateTest}
                                mutationDelete={deleteTest}
                                className={style.test}/>
                )}
            />
        </>
    )
}

export default Tests;
