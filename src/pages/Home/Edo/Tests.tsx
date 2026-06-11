import { JSX } from "react";
import { TestType } from "@/interfaces/api/TestType.ts";
import DataList from "@/components/ui/custom/DataList";
import TestItem from "@/components/ui/custom/Test";
import { useGetEdoTestsQuery } from "@/services/store/features/edo.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";

function Tests(): JSX.Element {
  const { data, error, isLoading } = useGetEdoTestsQuery("");

  return (
    <OverflowScrollBlock>
      <DataList<TestType>
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: TestType) => (
          <TestItem key={item.id} test={item} className="mt-4" />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Tests;
