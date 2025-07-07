import {JSX} from "react";
import style from "./Edo.module.css";
import {Link} from "react-router-dom";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import CourseItem from "../../../components/ui/Course/Course.tsx";
import EventItem from "../../../components/ui/Event/Event.tsx";
import TestItem from "../../../components/ui/Test/Test.tsx";
import {EventType} from "../../../types";
import {CourseType} from "../../../types/components/CourseType.ts";
import {
    useGetEdoCoursesQuery,
    useGetEdoEventsQuery,
    useGetEdoTestsQuery
} from "../../../services/store/features/edoApi.ts";

function Edo(): JSX.Element {
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEdoCoursesQuery("");
    const {data: eventData, error: eventError, isLoading: eventLoading} = useGetEdoEventsQuery("");
    const {data: testData, error: testError, isLoading: testLoading} = useGetEdoTestsQuery("");


    return (
        <>
            <HeaderPage>Единый день обучения</HeaderPage>

            <h3 className={style.header_services}>Электронные курсы</h3>
            <div className={style.container}>
                {courseError ? (
                    <>Ошибка</>
                ) : courseLoading ? (
                    <>Загрузка...</>
                ) : courseData && courseData.length > 0 ? (
                    <>
                        <div className={style.courses_list}>
                            {courseData.slice(0, 3).map((item: CourseType): JSX.Element => {
                                return (
                                    <CourseItem key={item.id} course={item} className={style.course}/>
                                )
                            })}
                        </div>
                        <Link to="courses" className={style.link}>Смотреть все</Link>
                    </>
                ) : (
                    <div>Курсов нет</div>
                )}
            </div>

            <h3 className={style.header_services}>Мероприятия</h3>
            <div className={style.container}>
                {eventError ? (
                    <>Ошибка</>
                ) : eventLoading ? (
                    <>Загрузка...</>
                ) : eventData && eventData.length > 0 ? (
                    <>
                        {eventData.slice(0, 3).map((item: EventType): JSX.Element => {
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
                {testError ? (
                    <>Ошибка</>
                ) : testLoading ? (
                    <>Загрузка...</>
                ) : testData && testData.length > 0 ? (
                    <>
                        <div className={style.courses_list}>
                            {testData.slice(0, 3).map((item: CourseType): JSX.Element => {
                                return (
                                    <TestItem key={item.id} test={item} className={style.test}/>
                                )
                            })}
                        </div>
                        <Link to="tests" className={style.link}>Смотреть все</Link>
                    </>
                ) : (
                    <div>Тестов нет</div>
                )}
            </div>
        </>
    );
}

export default Edo;
