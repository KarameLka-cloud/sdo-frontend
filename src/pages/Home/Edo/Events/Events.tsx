import {JSX} from "react";
import {Event} from "../../../../types";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";
import EventItem from "../../../../components/ui/EventItem/EventItem.tsx";
import {useGetEdoEventsQuery} from "../../../../services/store/features/edoApi";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEdoEventsQuery("");

    return (
        <>
            <HeaderPage>Мероприятия</HeaderPage>

            {error ? (
                <>Ошибка</>
            ) : isLoading ? (
                <>Загрузка...</>
            ) : data != data.length ? (
                data.map((item: Event) => {
                    return (
                        <EventItem key={item.id} event={item}/>
                    )
                })
            ) : (
                <div>Мероприятий нет</div>
            )}
        </>
    );
}

export default Events;
