import { JSX } from "react";
import style from "./Events.module.css";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";
import { useGetEventEdoByDataQuery } from "../../../../services/store/features/edoApi";

function Events(): JSX.Element {
  const { data, error, isLoading } = useGetEventEdoByDataQuery("");

  type EventItem = {
    id: number;
    title: string;
    description: string;
    department: string;
    time: string;
  };

  return (
    <>
      <HeaderPage>Мероприятия</HeaderPage>
      {error ? (
        <>Ошибка</>
      ) : isLoading ? (
        <>Загрузка...</>
      ) : data != data.length ? (
        data.map((item: EventItem) => {
          return (
            <div className={style.event} key={item.id}>
              <div className={style.event_content}>
                <span className={style.event_header}>{item.title}</span>
                <span className={style.event_description}>
                  {item.description}
                </span>
                <span className={style.event_departments}>
                  {item.department}
                </span>
              </div>
              <div className={style.event_time}>
                <div style={{ textAlign: "center" }}>{item.time}</div>
                <div style={{ textAlign: "center" }}>01.01.2025</div>
              </div>
            </div>
          );
        })
      ) : (
        <>
          <div>Мероприятий нет</div>
        </>
      )}
    </>
  );
}

export default Events;
