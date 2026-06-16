import { JSX } from "react";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import DataList from "@/components/ui/custom/DataList";
import { useGetEducationWebinarsQuery } from "@/services/store/features/education.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import UniversalCard from "@/components/ui/custom/UniversalCard";

function Events(): JSX.Element {
  const { data, error, isLoading } = useGetEducationWebinarsQuery("");

  return (
    <OverflowScrollBlock>
      <DataList<WebinarType>
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: WebinarType) => (
          <UniversalCard type="webinar" item={item} className="mt-4" />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Events;
