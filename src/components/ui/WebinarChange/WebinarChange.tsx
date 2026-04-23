import { JSX } from "react";
import styles from "./WebinarChange.module.css";
import { WebinarType } from "@interfaces/api/WebinarType.ts";
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
  webinar: WebinarType;
  mutationDelete: (id: number) => { unwrap: () => Promise<unknown> };
  // mutationUpdate?: any;
}

function WebinarChange({
  className,
  webinar,
  mutationDelete,
}: EventPropsType): JSX.Element {
  // const {formItems, handleChange} = useForm({
  //     title: webinar.title,
  //     time_start: webinar.time_start,
  //     time_end: webinar.time_end,
  //     date: webinar.date,
  // });
  // const {value: edit, toggle: handleEdit} = useToggle();
  // const handleUpdate = useUpdate(mutationUpdate, "Обновить вебинар?");
  const handleDelete = useDelete(mutationDelete, "Удалить вебинар?");

  return (
    <div className={`${styles.webinar} ${className}`}>
      <div className={styles.content}>
        <span className={styles.title}>{webinar.title}</span>
        <span className={styles.date_time}>
          {`${convertDate(webinar.date)} | ${convertTime(webinar.time_start)}-${convertTime(webinar.time_end)}`}
        </span>
      </div>
      <IconButton
        type={"delete"}
        onClick={() => handleDelete(webinar.id)}
        className={styles.button_delete}
      />

      {/*{edit ?*/}
      {/*    <div className={styles.form}>*/}
      {/*        <Input type="text" name="title" value={formItems.title} onChange={handleChange}*/}
      {/*               className={styles.input}/>*/}
      {/*        <div>*/}
      {/*            <Input type="date" name="date" value={formItems.date} onChange={handleChange}/>*/}
      {/*            <Input type="time" name="time_start" value={formItems.time_start} onChange={handleChange}/>*/}
      {/*            <Input type="time" name="time_end" value={formItems.time_end} onChange={handleChange}/>*/}
      {/*        </div>*/}
      {/*    </div> :*/}
      {/*    <div className={styles.content}>*/}
      {/*        <span className={styles.title}>{webinar.title}</span>*/}
      {/*        <span*/}
      {/*            className={styles.date_time}>{`${convertDate(webinar.date)} | ${convertTime(webinar.time_start)}-${convertTime(webinar.time_end)}`}*/}
      {/*        </span>*/}
      {/*    </div>*/}
      {/*}*/}
      {/*{edit ? <>*/}
      {/*        <IconButton type={"save"} onClick={() => handleUpdate({id: webinar.id, ...formItems})}*/}
      {/*                    className={styles.button_save}/>*/}
      {/*        <IconButton type={"close"} onClick={handleEdit} className={styles.button_close}/>*/}
      {/*    </> :*/}
      {/*    <IconButton type={"edit"} onClick={handleEdit} className={styles.button_edit}/>*/}
      {/*}*/}
      {/*{!edit &&*/}
      {/*    <IconButton type={"delete"} onClick={() => handleDelete(webinar.id)} className={styles.button_delete}/>}*/}
    </div>
  );
}

export default WebinarChange;
