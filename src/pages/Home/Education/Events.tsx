import { JSX } from "react";
import { EventType } from "@/interfaces/api/EventType.ts";
import DataList from "@/components/ui/custom/DataList";
import { useGetEducationEventsQuery } from "@/services/store/features/education.ts";
import UniversalCard from "@/components/ui/custom/UniversalCard";

function Events(): JSX.Element {
  const { data, error, isLoading } = useGetEducationEventsQuery("");

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
