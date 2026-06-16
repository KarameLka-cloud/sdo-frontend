import { JSX } from "react";
import { TestType } from "@/interfaces/api/TestType.ts";
import DataList from "@/components/ui/custom/DataList";
import { useGetEdoTestsQuery } from "@/services/store/features/edo.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import UniversalCard from "@/components/ui/custom/UniversalCard";

function Tests(): JSX.Element {
  const { data, error, isLoading } = useGetEdoTestsQuery("");

  return (
    <OverflowScrollBlock>
      <DataList<TestType>
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: TestType) => (
          <UniversalCard type="test" item={item} className="mt-4" />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Tests;
