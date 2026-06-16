import { JSX } from "react";
import { EventType } from "@/interfaces/api/EventType.ts";
import DataList from "@/components/ui/custom/DataList";
import { useGetEdoEventsQuery } from "@/services/store/features/edo.ts";
import UniversalCard from "@/components/ui/custom/UniversalCard";

function Events(): JSX.Element {
  const { data, error, isLoading } = useGetEdoEventsQuery("");

  return (
    <DataList<EventType>
      data={data}
      error={!!error}
      isLoading={isLoading}
      renderItem={(item: EventType) => (
        <UniversalCard type="event" item={item} className="mt-4" />
      )}
    />
  );
}

export default Events;
