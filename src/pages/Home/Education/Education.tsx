import {JSX} from "react";
import styles from "./Education.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import DataMessage from "../../../components/ui/DataMessage/DataMessage.tsx";
import Loader from "../../../components/ui/Loader/Loader.tsx";
import EventItem from "../../../components/ui/Event/Event.tsx";
import WebinarItem from "../../../components/ui/Webinar/Webinar.tsx";
import ButtonSeeAll from "../../../components/ui/ButtonSeeAll/ButtonSeeAll.tsx";
import {
    useGetEducationEventsQuery,
    useGetEducationCoursesQuery,
    useGetEducationWebinarsQuery,
    useGetEducationTestsQuery
} from "../../../services/store/features/education.ts";
import {EventType} from "../../../interfaces/api/EventType.ts";
import {CourseType} from "../../../interfaces/api/CourseType.ts";
import {WebinarType} from "../../../interfaces/api/WebinarType.ts";
import {TestType} from "../../../interfaces/api/TestType.ts";
import CourseItem from "../../../components/ui/Course/Course.tsx";
import TestItem from "../../../components/ui/Test/Test.tsx";
import {ROUTES} from "../../../constants/routes.ts";

function Education(): JSX.Element {
    const {data: eventData, error: eventError, isLoading: eventLoading} = useGetEducationEventsQuery("");
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEducationCoursesQuery("");
    const {data: testData, error: testError, isLoading: testLoading} = useGetEducationTestsQuery("");
    const {data: webinarData, error: webinarError, isLoading: webinarLoading} = useGetEducationWebinarsQuery("");

    return (
        <>
            <HeaderPage>Обучение</HeaderPage>

            <h3 className={styles.header_services}>Мероприятия</h3>
            <div className={styles.container}>
                {eventError ? (
                    <DataMessage type={"error"}/>
                ) : eventLoading ? (
                    <Loader/>
                ) : eventData && eventData.length > 0 ? (
                    <>
                        {eventData.slice(0, 3).map((item: EventType): JSX.Element => {
                            return (
                                <EventItem key={item.id} event={item} className={styles.event}/>
                            )
                        })}
                        <ButtonSeeAll to={ROUTES.EDUCATION_EVENTS}/>
                    </>
                ) : (
                    <DataMessage type={"noData"}/>
                )}
            </div>

            <h3 className={styles.header_services}>Электронные курсы</h3>
            <div className={styles.container}>
                {courseError ? (
                    <DataMessage type={"error"}/>
                ) : courseLoading ? (
                    <Loader/>
                ) : courseData && courseData.length > 0 ? (
                    <>
                        <div className={styles.courses_list}>
                            {courseData.slice(0, 3).map((item: CourseType): JSX.Element => {
                                return (
                                    <CourseItem key={item.id} course={item} className={styles.course}/>
                                )
                            })}
                        </div>
                        <ButtonSeeAll to={ROUTES.EDUCATION_COURSES}/>
                    </>
                ) : (
                    <DataMessage type={"noData"}/>
                )}
            </div>

            <h3 className={styles.header_services}>Вебинары</h3>
            <div className={styles.container}>
                {webinarError ? (
                    <DataMessage type={"error"}/>
                ) : webinarLoading ? (
                    <Loader/>
                ) : webinarData && webinarData.length > 0 ? (
                    <>
                        {webinarData.slice(0, 3).map((item: WebinarType): JSX.Element => {
                            return (
                                <WebinarItem key={item.id} webinar={item} className={styles.event}/>
                            )
                        })}
                        <ButtonSeeAll to={ROUTES.EDUCATION_WEBINARS}/>
                    </>
                ) : (
                    <DataMessage type={"noData"}/>
                )}
            </div>

            <h3 className={styles.header_services}>Назначенные тесты</h3>
            <div className={styles.container}>
                {testError ? (
                    <DataMessage type={"error"}/>
                ) : testLoading ? (
                    <Loader/>
                ) : testData && testData.length > 0 ? (
                    <>
                        <div className={styles.courses_list}>
                            {testData.slice(0, 4).map((item: TestType): JSX.Element => {
                                return (
                                    <TestItem key={item.id} test={item} className={styles.test}/>
                                )
                            })}
                        </div>
                        <ButtonSeeAll to={ROUTES.EDUCATION_TESTS}/>
                    </>
                ) : (
                    <DataMessage type={"noData"}/>
                )}
            </div>
        </>
    )
}

export default Education;
