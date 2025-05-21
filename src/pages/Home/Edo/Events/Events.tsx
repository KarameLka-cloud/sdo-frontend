import {JSX} from "react";
import {Event} from "../../../../types";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";
import EventItem from "../../../../components/ui/EventItem/EventItem.tsx";
import {useGetEventsEdoQuery} from "../../../../services/store/features/edoApi";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEventsEdoQuery("");

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
