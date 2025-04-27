import { JSX } from "react";
import style from "./Edo.module.css";
import { Link } from "react-router-dom";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage";

function Edo(): JSX.Element {
  return (
    <>
      <HeaderPage>Единый день обучения</HeaderPage>

      <div className={style.events_container}>
        <h3 className={style.header_services}>Мероприятия</h3>
        <div className={style.events_list}>
          <div className={style.event}>
            <div className={style.event_content}>
              <span className={style.event_title}>
                Встреча с представителем Сбербанка
              </span>
              <span className={style.event_description}>ВКС</span>
              <span className={style.event_departments}>
                Иркутские отделения
              </span>
            </div>
            <div className={style.event_time}>10 : 30</div>
          </div>

          <div className={style.event}>
            <div className={style.event_content}>
              <span className={style.event_title}>
                Встреча с представителем Сбербанка
              </span>
              <span className={style.event_description}>ВКС</span>
              <span className={style.event_departments}>
                Иркутские отделения
              </span>
            </div>
            <div className={style.event_time}>10 : 30</div>
          </div>

          <div className={style.event}>
            <div className={style.event_content}>
              <span className={style.event_title}>
                Встреча с представителем Сбербанка
              </span>
              <span className={style.event_description}>ВКС</span>
              <span className={style.event_departments}>
                Иркутские отделения
              </span>
            </div>
            <div className={style.event_time}>10 : 30</div>
          </div>
          <Link to="events" className={style.events_link}>
            Смотреть все
          </Link>
        </div>
      </div>
    </>
  );
}

export default Edo;
