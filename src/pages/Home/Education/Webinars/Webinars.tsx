import {JSX} from "react";
import styles from "./Webinars.module.css";
import {WebinarType} from "@interfaces/api/WebinarType.ts";
import DataList from "@components/ui/DataList/DataList.tsx";
import WebinarItem from "@components/ui/Webinar/Webinar.tsx";
import {useGetEducationWebinarsQuery} from "@services/store/features/education.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEducationWebinarsQuery("");

    return (
        <OverflowScrollBlock header_name={'Вебинары'} button_back_visible={'enable'}>
            <DataList<WebinarType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: WebinarType) => (
                    <WebinarItem key={item.id} webinar={item} className={styles.webinar}/>
                )}
            />
        </OverflowScrollBlock>
    );
}

export default Events;
