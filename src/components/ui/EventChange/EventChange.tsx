import { JSX } from "react";
import styles from "./EventChange.module.css";
import { EventType } from "@interfaces/api/EventType.ts";
import convertDate from "@utils/convertDate.ts";
// import {useForm} from "@hooks/useForm.ts";
// import {useToggle} from "@hooks/useToggle.ts";
// import {useUpdate} from "@hooks/useUpdate.ts";
import { useDelete } from "@hooks/useDelete.ts";
import { convertTime } from "@utils/convertTime.ts";
// import Input from "../Input/Input.tsx";
import IconButton from "../IconButton/IconButton.tsx";

interface EventPropsType {
  className?: string;
  event: EventType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
  // mutationUpdate?: any;
}

function EventChange({
  className,
  event,
  mutationDelete,
}: EventPropsType): JSX.Element {
  // const {formItems, handleChange} = useForm({
  //     title: event.title,
  //     description: event.description,
  //     department: event.department,
  //     date: event.date,
  //     time: event.time,
  // });
  // const {value: edit, toggle: handleEdit} = useToggle();
  // const handleUpdate = useUpdate(mutationUpdate, "Обновить мероприятие?");
  const handleDelete = useDelete(mutationDelete, "Удалить мероприятие?");

  return (
    <div className={`${styles.event} ${className}`}>
      <div className={styles.content}>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.description}>{event.description}</span>
        {event.link && <span className={styles.link}>{event.link}</span>}
        <span className={styles.department}>
          {event.department}{" "}
          {event.note_department && `(${event.note_department})`}
        </span>
        <span className={styles.date_time}>
          {convertDate(event.date)}{" "}
          {event.time && `| ${convertTime(event.time)}`}
        </span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(event.id)}
        className={styles.button_delete}
      />

      {/*{edit ?*/}
      {/*    <div className={styles.form}>*/}
      {/*        <Input type="text" name="title" value={formItems.title} onChange={handleChange}*/}
      {/*               className={styles.input}/>*/}
      {/*        <Input type="text" name="description" value={formItems.description} onChange={handleChange}*/}
      {/*               className={styles.input}/>*/}
      {/*        <Input type="text" name="department" value={formItems.department} onChange={handleChange}*/}
      {/*               className={styles.input}/>*/}
      {/*        <div>*/}
      {/*            <Input type="date" name="date" value={formItems.date} onChange={handleChange}/>*/}
      {/*            <Input type="time" name="time" value={formItems.time} onChange={handleChange}/>*/}
      {/*        </div>*/}
      {/*    </div> :*/}
      {/*    <div className={styles.content}>*/}
      {/*        <div className={styles.title}>{event.title}</div>*/}
      {/*        <div className={styles.description}>{event.description}</div>*/}
      {/*        <div className={styles.department}>{event.department}</div>*/}
      {/*        <div*/}
      {/*            className={styles.date_time}>{convertDate(event.date)} {event.time && `| ${convertTime(event.time)}`}*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*}*/}
      {/*{edit ? <>*/}
      {/*        <IconButton type={"save"} onClick={() => handleUpdate({id: event.id, ...formItems})}*/}
      {/*                    className={styles.button_save}/>*/}
      {/*        <IconButton type={"close"} onClick={handleEdit} className={styles.button_close}/>*/}
      {/*    </> :*/}
      {/*    <IconButton type={"edit"} onClick={handleEdit} className={styles.button_edit}/>*/}
      {/*}*/}
      {/*{!edit &&*/}
      {/*    <IconButton type={"delete"} onClick={() => handleDelete(event.id)} className={styles.button_delete}/>}*/}
    </div>
  );
}

export default EventChange;
