import {JSX} from "react";
import styles from "./Events.module.css";
import {EventType} from "../../../../interfaces/api/EventType.ts";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import DataList from "../../../../components/ui/DataList/DataList.tsx";
import EventItem from "../../../../components/ui/Event/Event.tsx";
import {useGetEducationEventsQuery} from "../../../../services/store/features/education.ts";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEducationEventsQuery("");

    return (
        <>
            <HeaderPage>Мероприятия</HeaderPage>
            <ButtonBack/>

            <DataList<EventType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: EventType) => (
                    <EventItem key={item.id} event={item} className={styles.event}/>
                )}
            />
        </>
    );
}

export default Events;
