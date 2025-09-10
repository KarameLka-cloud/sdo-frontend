import {TestType} from "../../../interfaces/api/TestType.ts";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useDelete} from "../../../hooks/useDelete.ts";
import styles from "./TestChange.module.css";
import convertDate from "../../../utils/convertDate.ts";
import {JSX} from "react";
import {useUpdate} from "../../../hooks/useUpdate.ts";
import Input from "../Input/Input.tsx";
import IconButton from "../IconButton/IconButton.tsx";


interface TestPropsType {
    className?: string;
    test: TestType;
    mutationUpdate: any;
    mutationDelete: any;
}

function TestChange({className, test, mutationUpdate, mutationDelete}: TestPropsType): JSX.Element {
    const {formItems, handleChange} = useForm({
        title: test.title,
        url: test.url,
        date_end: test.date_end,
    });
    const {value: edit, toggle: handleEdit} = useToggle();
    const handleUpdate = useUpdate(mutationUpdate, "Обновить тест?");
    const handleDelete = useDelete(mutationDelete, "Удалить тест?");

    return (
        <div className={`${styles.test} ${className}`}>
            {edit ?
                <div className={styles.form}>
                    <Input type="text" name="title" value={formItems.title} onChange={handleChange}
                           className={styles.input}/>
                    <Input type="text" name="url" value={formItems.url} onChange={handleChange}
                           className={styles.input}/>
                    <Input type="date" name="date_end" value={formItems.date_end} onChange={handleChange}
                           className={styles.input}/>
                </div> :
                <div className={styles.content}>
                    <div className={styles.title}>{test.title}</div>
                    <div className={styles.url}>{test.url}</div>
                    <div className={styles.date_end}>{convertDate(test.date_end)}</div>
                </div>
            }
            {edit ? <>
                    <IconButton type={"save"} onClick={() => handleUpdate({id: test.id, ...formItems})}
                                className={styles.button_save}/>
                    <IconButton type={"close"} onClick={handleEdit} className={styles.button_close}/>
                </> :
                <IconButton type={"edit"} onClick={handleEdit} className={styles.button_edit}/>
            }
            {!edit &&
                <IconButton type={"delete"} onClick={() => handleDelete(test.id)} className={styles.button_delete}/>}
        </div>
    )
}

export default TestChange;
