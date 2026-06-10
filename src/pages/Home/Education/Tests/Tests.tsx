import { JSX } from "react";
import styles from "./Tests.module.css";
import { TestType } from "@/interfaces/api/TestType.ts";
import DataList from "@/components/ui/DataList/DataList";
import TestItem from "@/components/ui/Test/Test";
import { useGetEducationTestsQuery } from "@/services/store/features/education.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";

function Tests(): JSX.Element {
  const { data, error, isLoading } = useGetEducationTestsQuery("");

  return (
    <OverflowScrollBlock>
      <DataList<TestType>
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: TestType) => (
          <TestItem key={item.id} test={item} className={styles.test} />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Tests;
