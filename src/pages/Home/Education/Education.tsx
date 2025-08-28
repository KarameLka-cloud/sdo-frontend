import {JSX} from "react";
import style from "./Education.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import ErrorData from "../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../components/ui/Loader/Loader.tsx";
import {EventType} from "../../../types/components/EventType.ts";
import EventItem from "../../../components/ui/Event/Event.tsx";
import ButtonSeeAll from "../../../components/ui/ButtonSeeAll/ButtonSeeAll.tsx";
import NoData from "../../../components/ui/NoData/NoData.tsx";
import {
    useGetEducationEventsQuery,
    useGetEducationCoursesQuery,
    useGetEducationTestsQuery
} from "../../../services/store/features/education.ts";
import {CourseType} from "../../../types/components/CourseType.ts";
import CourseItem from "../../../components/ui/Course/Course.tsx";
import TestItem from "../../../components/ui/Test/Test.tsx";

function Education(): JSX.Element {
    const {data: eventData, error: eventError, isLoading: eventLoading} = useGetEducationEventsQuery("");
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEducationCoursesQuery("");
    const {data: testData, error: testError, isLoading: testLoading} = useGetEducationTestsQuery("");

    return (
        <>
            <HeaderPage>Обучение</HeaderPage>

            <h3 className={style.header_services}>Мероприятия</h3>
            <div className={style.container}>
                {eventError ? (
                    <ErrorData/>
                ) : eventLoading ? (
                    <Loader/>
                ) : eventData && eventData.length > 0 ? (
                    <>
                        {eventData.slice(0, 3).map((item: EventType): JSX.Element => {
                            return (
                                <EventItem key={item.id} event={item} className={style.event}/>
                            )
                        })}
                        <ButtonSeeAll to="events"/>
                    </>
                ) : (
                    <NoData>Мероприятий нет</NoData>
                )}
            </div>

            <h3 className={style.header_services}>Электронные курсы</h3>
            <div className={style.container}>
                {courseError ? (
                    <ErrorData/>
                ) : courseLoading ? (
                    <Loader/>
                ) : courseData && courseData.length > 0 ? (
                    <>
                        <div className={style.courses_list}>
                            {courseData.slice(0, 3).map((item: CourseType): JSX.Element => {
                                return (
                                    <CourseItem key={item.id} course={item} className={style.course}/>
                                )
                            })}
                        </div>
                        <ButtonSeeAll to="courses"/>
                    </>
                ) : (
                    <NoData>Курсов нет</NoData>
                )}
            </div>

            <h3 className={style.header_services}>Назначенные тесты</h3>
            <div className={style.container}>
                {testError ? (
                    <ErrorData/>
                ) : testLoading ? (
                    <Loader/>
                ) : testData && testData.length > 0 ? (
                    <>
                        <div className={style.courses_list}>
                            {testData.slice(0, 4).map((item: CourseType): JSX.Element => {
                                return (
                                    <TestItem key={item.id} test={item} className={style.test}/>
                                )
                            })}
                        </div>
                        <ButtonSeeAll to="tests"/>
                    </>
                ) : (
                    <NoData>Тестов нет</NoData>
                )}
            </div>
        </>
    )
}

export default Education;
