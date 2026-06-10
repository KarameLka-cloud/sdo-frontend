import { JSX } from "react";
import { EventType } from "@/interfaces/api/EventType.ts";
import DataList from "@/components/ui/custom/DataList";
import EventItem from "@/components/ui/Event/Event";
import { useGetEducationEventsQuery } from "@/services/store/features/education.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";

function Events(): JSX.Element {
  const { data, error, isLoading } = useGetEducationEventsQuery("");

  return (
    <OverflowScrollBlock>
      <DataList<EventType>
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: EventType) => (
          <EventItem key={item.id} event={item} className="mt-4" />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Events;
