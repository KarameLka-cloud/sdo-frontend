import {JSX, useState} from "react";
import style from "./Tests.module.css";
import {TestType} from "../../../../types/components/TestType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import InputDate from "../../../../components/ui/InputDate/InputDate.tsx";
import InputText from "../../../../components/ui/InputText/InputText.tsx";
import ButtonSubmit from "../../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import TestItem from "../../../../components/ui/Test/Test.tsx";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import {
    useGetEdoTestsQuery,
    useAddEdoTestMutation,
    useDeleteEdoTestMutation
} from "../../../../services/store/features/edo.ts";

function Tests(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEdoTestsQuery("");
    const [addEdoTest, {isLoading: addLoading, isError: addError}] = useAddEdoTestMutation();
    const [deleteTest] = useDeleteEdoTestMutation();

    const [formData, setFormData] = useState({
        title: "",
        url: "",
        date_end: ""
    });

    const handleChange = (e: {
        target: { name: string; value: string };
    }): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const handleAddEdoTest = async (e: any) => {
        e.preventDefault();
        await addEdoTest(formData).unwrap();
        setFormData({
            title: "",
            url: "",
            date_end: ""
        })
    }

    return (
        <>
            <ButtonBack/>
            <form onSubmit={handleAddEdoTest} className={style.form}>
                <InputText type="text" name="title" placeholder="Название" value={formData.title}
                           onChange={handleChange} className={style.form_input_text}/>
                <InputText type="text" name="url" placeholder="Ссылка на тест" value={formData.url}
                           onChange={handleChange} className={style.form_input_text}/>
                <InputDate type="date" name="date_end" placeholder="Пройти до" value={formData.date_end}
                           onChange={handleChange}
                           className={style.form_input_date_end}/>
                <ButtonSubmit loading={addLoading} className={style.button_create}>Создать</ButtonSubmit>
            </form>
            <hr/>
            {listError ? (
                <ErrorData/>
            ) : listLoading ? (
                <Loader/>
            ) : listData && listData.length > 0 ? (
                listData.map((item: TestType) => {
                    return (
                        <TestItem key={item.id} test={item} mutation={deleteTest} className={style.test}/>
                    )
                })
            ) : <>Тестов нет</>
            }
        </>
    )
}

export default Tests;
