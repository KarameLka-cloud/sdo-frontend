import {JSX} from "react";
import styles from "./Edo.module.css";
import firstWednesdayData from "@utils/firstWednesday.ts";
import CourseItem from "@components/ui/Course/Course.tsx";
import EventItem from "@components/ui/Event/Event.tsx";
import TestItem from "@components/ui/Test/Test.tsx";
import ButtonSeeAll from "@components/ui/ButtonSeeAll/ButtonSeeAll.tsx";
import {EventType} from "@interfaces/api/EventType.ts";
import {CourseType} from "@interfaces/api/CourseType.ts";
import {TestType} from "@interfaces/api/TestType.ts";
import {
    useGetEdoCoursesQuery,
    useGetEdoEventsQuery,
    useGetEdoTestsQuery
} from "@services/store/features/edo.ts";
import {ROUTES} from "@constants/routes.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";

function Edo(): JSX.Element {
    const {data: eventData, error: eventError, isLoading: eventLoading} = useGetEdoEventsQuery("");
    const {data: courseData, error: courseError, isLoading: courseLoading} = useGetEdoCoursesQuery("");
    const {data: testData, error: testError, isLoading: testLoading} = useGetEdoTestsQuery("");

    return (
        <OverflowScrollBlock header_name={`Единый день обучения | ${firstWednesdayData}`}>
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
                {eventData && (eventData.length > 0 && <ButtonSeeAll to={ROUTES.EDO_EVENTS}/>)}
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
                {courseData && (courseData.length > 0 && <ButtonSeeAll to={ROUTES.EDO_COURSES}/>)}
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
                {testData && (testData.length > 0 && <ButtonSeeAll to={ROUTES.EDO_TESTS}/>)}
            </div>
        </OverflowScrollBlock>
    );
}

export default Edo;
