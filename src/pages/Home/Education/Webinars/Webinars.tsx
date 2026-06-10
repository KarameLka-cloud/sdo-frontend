import { JSX } from "react";
import styles from "./Webinars.module.css";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import DataList from "@/components/ui/DataList/DataList";
import WebinarItem from "@/components/ui/Webinar/Webinar";
import { useGetEducationWebinarsQuery } from "@/services/store/features/education.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";

function Events(): JSX.Element {
  const { data, error, isLoading } = useGetEducationWebinarsQuery("");

  return (
    <OverflowScrollBlock>
      <DataList<WebinarType>
        data={data}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: WebinarType) => (
          <WebinarItem
            key={item.id}
            webinar={item}
            className={styles.webinar}
          />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Events;
