import {JSX} from "react";
import style from "./Edo.module.css";
import firstWednesdayData from "../../../utils/firstWednesday.ts";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";
import Loader from "../../../components/ui/Loader/Loader.tsx";
import DataMessage from "../../../components/ui/DataMessage/DataMessage.tsx";
import CourseItem from "../../../components/ui/Course/Course.tsx";
import EventItem from "../../../components/ui/Event/Event.tsx";
import TestItem from "../../../components/ui/Test/Test.tsx";
import ButtonSeeAll from "../../../components/ui/ButtonSeeAll/ButtonSeeAll.tsx";
import {EventType} from "../../../interfaces/api/EventType.ts";
import {CourseType} from "../../../interfaces/api/CourseType.ts";
import {
    useGetEdoCoursesQuery,
    useGetEdoEventsQuery,
    useGetEdoTestsQuery
} from "../../../services/store/features/edo.ts";
import {ROUTES} from "../../../constants/routes.ts";

function Edo(): JSX.Element {
    const {data: eventData, error: eventError, isLoading: eventLoading} = useGetEdoEventsQuery("");
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEdoCoursesQuery("");
    const {data: testData, error: testError, isLoading: testLoading} = useGetEdoTestsQuery("");


    return (
        <>
            <HeaderPage>
                Единый день обучения <span className={style.firstWednesday}>{firstWednesdayData}</span>
            </HeaderPage>

            <h3 className={style.header_services}>Мероприятия</h3>
            <div className={style.container}>
                {eventError ? (
                    <DataMessage type={"error"}/>
                ) : eventLoading ? (
                    <Loader/>
                ) : eventData && eventData.length > 0 ? (
                    <>
                        {eventData.slice(0, 3).map((item: EventType): JSX.Element => {
                            return (
                                <EventItem key={item.id} event={item} className={style.event}/>
                            )
                        })}
                        <ButtonSeeAll to={ROUTES.EDO_EVENTS}/>
                    </>
                ) : (
                    <DataMessage type={"no_data"}/>
                )}
            </div>

            <h3 className={style.header_services}>Электронные курсы</h3>
            <div className={style.container}>
                {courseError ? (
                    <DataMessage type={"error"}/>
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
                        <ButtonSeeAll to={ROUTES.EDO_COURSES}/>
                    </>
                ) : (
                    <DataMessage type={"no_data"}/>
                )}
            </div>

            <h3 className={style.header_services}>Назначенные тесты</h3>
            <div className={style.container}>
                {testError ? (
                    <DataMessage type={"error"}/>
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
                        <ButtonSeeAll to={ROUTES.EDO_TESTS}/>
                    </>
                ) : (
                    <DataMessage type={"no_data"}/>
                )}
            </div>
        </>
    );
}

export default Edo;
