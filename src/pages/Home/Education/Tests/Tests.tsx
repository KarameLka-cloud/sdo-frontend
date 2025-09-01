import {JSX} from "react";
import style from "./Tests.module.css";
import {CourseType} from "../../../../types/api/CourseType.ts";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import NoData from "../../../../components/ui/NoData/NoData.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage.tsx";
import TestItem from "../../../../components/ui/Test/Test.tsx";
import {useGetEducationTestsQuery} from "../../../../services/store/features/education.ts";

function Tests(): JSX.Element {
    const {data: testData, error: testError, isLoading: testLoading} = useGetEducationTestsQuery("");

    return (
        <>
            <HeaderPage>Назначенные тесты</HeaderPage>
            <ButtonBack/>

            {testError ? (
                <ErrorData/>
            ) : testLoading ? (
                <Loader/>
            ) : testData && testData.length > 0 ? (
                testData.map((item: CourseType): JSX.Element => {
                    return (
                        <TestItem key={item.id} test={item} className={style.test}/>
                    )
                })
            ) : (
                <NoData>Тестов нет</NoData>
            )}
        </>
    )
}

export default Tests;
