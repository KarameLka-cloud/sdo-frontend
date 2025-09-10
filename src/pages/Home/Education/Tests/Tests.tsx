import {JSX} from "react";
import styles from "./Tests.module.css";
import {TestType} from "../../../../interfaces/api/TestType.ts";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import DataList from "../../../../components/ui/DataList/DataList.tsx";
import TestItem from "../../../../components/ui/Test/Test.tsx";
import {useGetEducationTestsQuery} from "../../../../services/store/features/education.ts";

function Tests(): JSX.Element {
    const {data, error, isLoading} = useGetEducationTestsQuery("");

    return (
        <>
            <HeaderPage>Назначенные тесты</HeaderPage>
            <ButtonBack/>

            <DataList<TestType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: TestType) => (
                    <TestItem key={item.id} test={item} className={styles.test}/>
                )}
            />
        </>
    )
}

export default Tests;
