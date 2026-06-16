import { JSX } from "react";
import { TestType } from "@/interfaces/api/TestType.ts";
import DataList from "@/components/ui/custom/DataList";
import { useGetEducationTestsQuery } from "@/services/store/features/education.ts";
import UniversalCard from "@/components/ui/custom/UniversalCard";

function Tests(): JSX.Element {
  const { data, error, isLoading } = useGetEducationTestsQuery("");

  return (
    <DataList<TestType>
      data={data}
      error={!!error}
      isLoading={isLoading}
      renderItem={(item: TestType) => (
        <UniversalCard type="test" item={item} className="mt-4" />
      )}
    />
  );
}

export default Tests;
