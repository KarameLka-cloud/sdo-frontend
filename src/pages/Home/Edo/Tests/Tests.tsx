import {JSX} from "react";
import style from "./Tests.module.css";
import {CourseType} from "../../../../types/components/CourseType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage.tsx";
import TestItem from "../../../../components/ui/Test/Test.tsx";
import {useGetEdoTestsQuery} from "../../../../services/store/features/edoApi.ts";

function Tests(): JSX.Element {
    const {data: testData, error: testError, isLoading: testLoading} = useGetEdoTestsQuery("");

    return (
        <>
            <HeaderPage>Назначенные тесты</HeaderPage>
            <ButtonBack/>

            {testError ? (
                <>Ошибка</>
            ) : testLoading ? (
                <>Загрузка...</>
            ) : testData && testData.length > 0 ? (
                testData.map((item: CourseType): JSX.Element => {
                    return (
                        <TestItem key={item.id} test={item} className={style.test}/>
                    )
                })
            ) : (
                <div>Тестов нет</div>
            )}
        </>
    )
}

export default Tests;
