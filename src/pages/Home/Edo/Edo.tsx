import {JSX} from "react";
import style from "./Edo.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import ErrorData from "../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../components/ui/Loader/Loader.tsx";
import NoData from "../../../components/ui/NoData/NoData.tsx";
import CourseItem from "../../../components/ui/Course/Course.tsx";
import EventItem from "../../../components/ui/Event/Event.tsx";
import TestItem from "../../../components/ui/Test/Test.tsx";
import SeeAllButton from "../../../components/ui/SeeAllButton/SeeAllButton";
import {EventType} from "../../../types/components/EventType.ts";
import {CourseType} from "../../../types/components/CourseType.ts";
import {
    useGetEdoCoursesQuery,
    useGetEdoEventsQuery,
    useGetEdoTestsQuery
} from "../../../services/store/features/edo.ts";

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
                    <ErrorData/>
                ) : courseLoading ? (
                    <Loader className={style.loader}/>
                ) : courseData && courseData.length > 0 ? (
                    <>
                        <div className={style.courses_list}>
                            {courseData.slice(0, 3).map((item: CourseType): JSX.Element => {
                                return (
                                    <CourseItem key={item.id} course={item} className={style.course}/>
                                )
                            })}
                        </div>
                        <SeeAllButton to="courses"/>
                    </>
                ) : (
                    <NoData>Курсов нет</NoData>
                )}
            </div>

            <h3 className={style.header_services}>Мероприятия</h3>
            <div className={style.container}>
                {eventError ? (
                    <ErrorData/>
                ) : eventLoading ? (
                    <Loader className={style.loader}/>
                ) : eventData && eventData.length > 0 ? (
                    <>
                        {eventData.slice(0, 3).map((item: EventType): JSX.Element => {
                            return (
                                <EventItem key={item.id} event={item}/>
                            )
                        })}
                        <SeeAllButton to="events"/>
                    </>
                ) : (
                    <NoData>Мероприятий нет</NoData>
                )}
            </div>

            <h3 className={style.header_services}>Назначенные тесты</h3>
            <div className={style.container}>
                {testError ? (
                    <ErrorData/>
                ) : testLoading ? (
                    <Loader className={style.loader}/>
                ) : testData && testData.length > 0 ? (
                    <>
                        <div className={style.courses_list}>
                            {testData.slice(0, 3).map((item: CourseType): JSX.Element => {
                                return (
                                    <TestItem key={item.id} test={item} className={style.test}/>
                                )
                            })}
                        </div>
                        <SeeAllButton to="tests"/>
                    </>
                ) : (
                    <NoData>Тестов нет</NoData>
                )}
            </div>
        </>
    );
}

export default Edo;
