import React, {JSX} from "react";
import styles from "./Tests.module.css";
import {TestType} from "@interfaces/api/TestType.ts";
import ButtonBack from "@components/ui/ButtonBack/ButtonBack.tsx";
import Input from "@components/ui/Input/Input.tsx";
import Select from "@components/ui/Select/Select.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import TestChange from "@components/ui/TestChange/TestChange.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";
import {useForm} from "@hooks/useForm.ts";
import {
    useGetEdoTestsQuery,
    useAddEdoTestMutation,
    useDeleteEdoTestMutation,
    useUpdateEdoTestMutation
} from "@services/store/features/edo.ts";
import {useGetPositionsQuery} from "@services/store/features/user.ts";

function Tests(): JSX.Element {
    const {data, error, isLoading} = useGetEdoTestsQuery("");
    const [addTest, {isLoading: addLoading, isError: addError}] = useAddEdoTestMutation();
    const [updateTest] = useUpdateEdoTestMutation();
    const [deleteTest] = useDeleteEdoTestMutation();
    const {data: positions} = useGetPositionsQuery("");

    const {formItems, setFormItems, handleChange} = useForm({
        title: "",
        url: "",
        position_id: "",
        note_position: "",
        date_end: ""
    });

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        await addTest(formItems).unwrap();
        setFormItems({
            title: "",
            url: "",
            position_id: "",
            note_position: "",
            date_end: ""
        })
    }

    return (
        <>
            <ButtonBack/>
            <form onSubmit={handleAction} className={styles.form}>
                <Input type="text" name="title" placeholder="Название" value={formItems.title}
                       onChange={handleChange} className={styles.form_input_text}/>
                <Input type="text" name="url" placeholder="Ссылка" value={formItems.url}
                       onChange={handleChange} className={styles.form_input_text}/>
                <div className={styles.form_position}>
                    {positions &&
                        <Select name={"position_id"} value={formItems.position_id} onChange={handleChange}
                                data={positions} className={styles.form_select}/>
                    }
                    <Input type="text" name="note_position" placeholder="Примечание по должности (опционально)"
                           value={formItems.note_position}
                           onChange={handleChange} className={styles.form_note_position}/>
                </div>
                <Input type="date" name="date_end" placeholder="Пройти до" value={formItems.date_end}
                       onChange={handleChange}
                       className={styles.form_input_date_end}/>
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
                                className={styles.test}/>
                )}
            />
        </>
    )
}

export default Tests;
