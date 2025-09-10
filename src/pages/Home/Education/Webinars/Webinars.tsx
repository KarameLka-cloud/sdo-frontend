import {JSX} from "react";
import styles from "./Webinars.module.css";
import {WebinarType} from "@interfaces/api/WebinarType.ts";
import HeaderPage from "@components/ui/HeaderPage/HeaderPage";
import ButtonBack from "@components/ui/ButtonBack/ButtonBack.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";
import WebinarItem from "@components/ui/Webinar/Webinar.tsx";
import {useGetEducationWebinarsQuery} from "@services/store/features/education.ts";

function Events(): JSX.Element {
    const {data, error, isLoading} = useGetEducationWebinarsQuery("");

    return (
        <>
            <HeaderPage>Мероприятия</HeaderPage>
            <ButtonBack/>

            <DataList<WebinarType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: WebinarType) => (
                    <WebinarItem key={item.id} webinar={item} className={styles.webinar}/>
                )}
            />
        </>
    );
}

export default Events;
