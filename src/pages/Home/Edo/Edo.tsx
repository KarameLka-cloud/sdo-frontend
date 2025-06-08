import {JSX} from "react";
import style from "./Edo.module.css";
import {Link} from "react-router-dom";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import EventItem from "../../../components/ui/Event/Event.tsx";
import {useGetEdoEventsQuery} from "../../../services/store/features/edoApi.ts";

function Edo(): JSX.Element {
    const {data, error, isLoading} = useGetEdoEventsQuery("");

    type EventItem = {
        id: number;
        title: string;
        description: string;
        department: string;
        time: string;
        date: string;
    };

    return (
        <>
            <HeaderPage>Единый день обучения</HeaderPage>

            <h3 className={style.header_services}>Электронные курсы</h3>

            <h3 className={style.header_services}>Мероприятия</h3>
            <div className={style.events_container}>
                {error ? (
                    <>Ошибка</>
                ) : isLoading ? (
                    <>Загрузка...</>
                ) : data && data.length > 0 ? (
                    <>
                        {data.slice(0, 3).map((item: EventItem): JSX.Element => {
                            return (
                                <EventItem key={item.id} event={item}/>
                            )
                        })}
                        <Link to="events" className={style.events_link}>Смотреть все</Link>
                    </>
                ) : (
                    <div>Мероприятий нет</div>
                )}
            </div>

            <h3 className={style.header_services}>Назначенные тесты</h3>
        </>
    );
}

export default Edo;
