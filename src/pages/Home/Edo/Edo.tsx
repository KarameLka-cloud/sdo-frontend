import {JSX} from "react";
import style from "./Edo.module.css";
import {Link} from "react-router-dom";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import EventItem from "../../../components/ui/Event/Event.tsx";
import {useGetEdoCoursesQuery, useGetEdoEventsQuery} from "../../../services/store/features/edoApi.ts";

function Edo(): JSX.Element {
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEdoCoursesQuery();
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
            {courseError ? (
                <div>error</div>
            ) : courseLoading ? (
                <div>loading...</div>
            ) : courseData ? (
                console.log(courseData)
            ) : null
            }

            <div className={style.container}>
                <div className={style.courses_list}>
                    <div className={style.course}>
                        <div className={style.title}>dfsdfsdfd</div>
                        <div className={style.date}>Пройти до 05.02.2025г.</div>
                    </div>
                    <div className={style.course}>
                        <div className={style.title}>dfsdfsdfd</div>
                        <div className={style.date}>Пройти до 05.02.2025г.</div>
                    </div>
                    <div className={style.course}>
                        <div className={style.title}>dfsdfsdfd</div>
                        <div className={style.date}>Пройти до 05.02.2025г.</div>
                    </div>
                </div>
                <Link to="courses" className={style.link}>Смотреть все</Link>
            </div>

            <h3 className={style.header_services}>Мероприятия</h3>
            <div className={style.container}>
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
                        <Link to="events" className={style.link}>Смотреть все</Link>
                    </>
                ) : (
                    <div>Мероприятий нет</div>
                )}
            </div>

            <h3 className={style.header_services}>Назначенные тесты</h3>
            <div className={style.container}>
                <div className={style.tests_list}>
                    <div className={style.course}>
                        <div className={style.title}>dfsdfsdfd</div>
                        <div className={style.date}>Пройти до 05.02.2025г.</div>
                    </div>
                    <div className={style.course}>
                        <div className={style.title}>dfsdfsdfd</div>
                        <div className={style.date}>Пройти до 05.02.2025г.</div>
                    </div>
                    <div className={style.course}>
                        <div className={style.title}>dfsdfsdfd</div>
                        <div className={style.date}>Пройти до 05.02.2025г.</div>
                    </div>
                </div>
                <Link to="tests" className={style.link}>Смотреть все</Link>
            </div>
        </>
    );
}

export default Edo;
