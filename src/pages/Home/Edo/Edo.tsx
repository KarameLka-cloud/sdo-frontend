import {JSX} from "react";
import styles from "./Edo.module.css";
import firstWednesdayData from "@utils/firstWednesday.ts";
import HeaderPage from "@components/ui/HeaderPage/HeaderPage";
import Loader from "@components/ui/Loader/Loader.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import CourseItem from "@components/ui/Course/Course.tsx";
import EventItem from "@components/ui/Event/Event.tsx";
import TestItem from "@components/ui/Test/Test.tsx";
import ButtonSeeAll from "@components/ui/ButtonSeeAll/ButtonSeeAll.tsx";
import {EventType} from "@interfaces/api/EventType.ts";
import {CourseType} from "@interfaces/api/CourseType.ts";
import {
    useGetEdoCoursesQuery,
    useGetEdoEventsQuery,
    useGetEdoTestsQuery
} from "@services/store/features/edo.ts";
import {ROUTES} from "@constants/routes.ts";

function Edo(): JSX.Element {
    const {data: eventData, error: eventError, isLoading: eventLoading} = useGetEdoEventsQuery("");
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEdoCoursesQuery("");
    const {data: testData, error: testError, isLoading: testLoading} = useGetEdoTestsQuery("");


    return (
        <>
            <HeaderPage>
                Единый день обучения <span className={styles.firstWednesday}>{firstWednesdayData}</span>
            </HeaderPage>

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
                        <ButtonSeeAll to={ROUTES.EDO_EVENTS}/>
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
                        <ButtonSeeAll to={ROUTES.EDO_COURSES}/>
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
                            {testData.slice(0, 4).map((item: CourseType): JSX.Element => {
                                return (
                                    <TestItem key={item.id} test={item} className={styles.test}/>
                                )
                            })}
                        </div>
                        <ButtonSeeAll to={ROUTES.EDO_TESTS}/>
                    </>
                ) : (
                    <DataMessage type={"noData"}/>
                )}
            </div>
        </>
    );
}

export default Edo;
