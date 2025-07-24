import {JSX} from "react";
import {EventType} from "../../../../types/components/EventType.ts";
import style from "./Events.module.css";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import NoData from "../../../../components/ui/NoData/NoData.tsx";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";
import EventItem from "../../../../components/ui/Event/Event.tsx";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import {useGetEdoEventsQuery} from "../../../../services/store/features/edo.ts";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEdoEventsQuery("");

    return (
        <>
            <HeaderPage>Мероприятия</HeaderPage>
            <ButtonBack/>

            {error ? (
                <ErrorData/>
            ) : isLoading ? (
                <Loader/>
            ) : data != data.length ? (
                data.map((item: EventType) => {
                    return (
                        <EventItem key={item.id} event={item} className={style.event}/>
                    )
                })
            ) : (
                <NoData>Мероприятий нет</NoData>
            )}
        </>
    );
}

export default Events;
