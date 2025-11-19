import {JSX} from "react";
import styles from "./Tests.module.css";
import {TestType} from "@interfaces/api/TestType.ts";
import DataList from "@components/ui/DataList/DataList.tsx";
import TestItem from "@components/ui/Test/Test.tsx";
import {useGetEdoTestsQuery} from "@services/store/features/edo.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function Tests(): JSX.Element {
    const {data, error, isLoading} = useGetEdoTestsQuery("");

    return (
        <OverflowScrollBlock header_name={'Назначенные тесты'} button_back_visible={'enable'}>
            <DataList<TestType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: TestType) => (
                    <TestItem key={item.id} test={item} className={styles.test}/>
                )}
            />
        </OverflowScrollBlock>
    )
}

export default Tests;
