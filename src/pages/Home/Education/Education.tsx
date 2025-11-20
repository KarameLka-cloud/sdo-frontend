import {JSX} from "react";
import styles from "./Education.module.css";
import EventItem from "@components/ui/Event/Event.tsx";
import WebinarItem from "@components/ui/Webinar/Webinar.tsx";
import ButtonSeeAll from "@components/ui/ButtonSeeAll/ButtonSeeAll.tsx";
import {
    useGetEducationEventsQuery,
    useGetEducationCoursesQuery,
    useGetEducationWebinarsQuery,
    useGetEducationTestsQuery
} from "@services/store/features/education.ts";
import {EventType} from "@interfaces/api/EventType.ts";
import {CourseType} from "@interfaces/api/CourseType.ts";
import {WebinarType} from "@interfaces/api/WebinarType.ts";
import {TestType} from "@interfaces/api/TestType.ts";
import CourseItem from "@components/ui/Course/Course.tsx";
import TestItem from "@components/ui/Test/Test.tsx";
import {ROUTES} from "@constants/routes.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";

function Education(): JSX.Element {
    const {data: eventData, error: eventError, isLoading: eventLoading} = useGetEducationEventsQuery("");
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEducationCoursesQuery("");
    const {data: testData, error: testError, isLoading: testLoading} = useGetEducationTestsQuery("");
    const {data: webinarData, error: webinarError, isLoading: webinarLoading} = useGetEducationWebinarsQuery("");

    return (
        <OverflowScrollBlock header_name={'Обучение'}>
            <h3 className={styles.header_services}>Мероприятия</h3>
            <div className={styles.block}>
                <DataList<EventType>
                    data={eventData}
                    error={!!eventError}
                    isLoading={eventLoading}
                    maxItems={3}
                    renderItem={(item: EventType) => (
                        <EventItem key={item.id} event={item} className={styles.event}/>
                    )}
                />
                {eventData && (eventData.length > 0 && <ButtonSeeAll to={ROUTES.EDUCATION_EVENTS}/>)}
            </div>

            <h3 className={styles.header_services}>Электронные курсы</h3>
            <div className={styles.block}>
                <div className={styles.courses_list}>
                    <DataList<CourseType>
                        data={courseData}
                        error={!!courseError}
                        isLoading={courseLoading}
                        maxItems={3}
                        renderItem={(item: CourseType) => (
                            <CourseItem key={item.id} course={item} className={styles.course}/>
                        )}
                    />
                </div>
                {courseData && (courseData.length > 0 && <ButtonSeeAll to={ROUTES.EDUCATION_COURSES}/>)}
            </div>


            <h3 className={styles.header_services}>Вебинары</h3>
            <div className={styles.block}>
                <DataList<WebinarType>
                    data={webinarData}
                    error={!!webinarError}
                    isLoading={webinarLoading}
                    maxItems={3}
                    renderItem={(item: WebinarType) => (
                        <WebinarItem key={item.id} webinar={item} className={styles.event}/>
                    )}
                />
                {webinarData && (webinarData.length > 0 && <ButtonSeeAll to={ROUTES.EDUCATION_WEBINARS}/>)}
            </div>

            <h3 className={styles.header_services}>Назначенные тесты</h3>
            <div className={styles.block}>
                <div className={styles.tests_list}>
                    <DataList<TestType>
                        data={testData}
                        error={!!testError}
                        isLoading={testLoading}
                        maxItems={4}
                        renderItem={(item: TestType) => (
                            <TestItem key={item.id} test={item} className={styles.test}/>
                        )}
                    />
                </div>
                {testData && (testData.length > 0 && <ButtonSeeAll to={ROUTES.EDUCATION_TESTS}/>)}
            </div>
        </OverflowScrollBlock>
    )
}

export default Education;
