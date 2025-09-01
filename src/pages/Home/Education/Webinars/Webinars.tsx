import {JSX} from "react";
import {WebinarType} from "../../../../types/api/WebinarType.ts";
import style from "./Webinars.module.css";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import NoData from "../../../../components/ui/NoData/NoData.tsx";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";
import WebinarItem from "../../../../components/ui/Webinar/Webinar.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import {useGetEducationWebinarsQuery} from "../../../../services/store/features/education.ts";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEducationWebinarsQuery("");

    return (
        <>
            <HeaderPage>Мероприятия</HeaderPage>
            <ButtonBack/>

            {error ? (
                <ErrorData/>
            ) : isLoading ? (
                <Loader/>
            ) : data != data.length ? (
                data.map((item: WebinarType) => {
                    return (
                        <WebinarItem key={item.id} webinar={item} className={style.webinar}/>
                    )
                })
            ) : (
                <NoData>Мероприятий нет</NoData>
            )}
        </>
    );
}

export default Events;
