import {JSX} from "react";
import styles from "./Events.module.css";
import {EventType} from "@interfaces/api/EventType.ts";
import DataList from "@components/ui/DataList/DataList.tsx";
import EventItem from "@components/ui/Event/Event.tsx";
import {useGetEducationEventsQuery} from "@services/store/features/education.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEducationEventsQuery("");

    return (
        <OverflowScrollBlock header_name={'Мероприятия'} button_back_visible={'enable'}>
            <DataList<EventType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: EventType) => (
                    <EventItem key={item.id} event={item} className={styles.event}/>
                )}
            />
        </OverflowScrollBlock>
    );
}

export default Events;
