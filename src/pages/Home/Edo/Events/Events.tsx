import {JSX} from "react";
// import style from "./Events.module.css";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";
import Event from "../../../../components/ui/Event/Event.tsx";
import {useGetEventsEdoQuery} from "../../../../services/store/features/edoApi";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEventsEdoQuery("");

    type EventItem = {
        id: number;
        title: string;
        description: string;
        department: string;
        time: string;
    };

    return (
        <>
            <HeaderPage>Мероприятия</HeaderPage>

            {error ? (
                <>Ошибка</>
            ) : isLoading ? (
                <>Загрузка...</>
            ) : data != data.length ? (
                data.map((item: EventItem) => {
                    return (
                        <Event event={item}/>
                    )
                })
            ) : (
                <div>Мероприятий нет</div>
            )}
        </>
    );
}

export default Events;
