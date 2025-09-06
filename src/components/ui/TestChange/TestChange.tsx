import {TestType} from "../../../interfaces/api/TestType.ts";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useDelete} from "../../../hooks/useDelete.ts";
import style from "./TestChange.module.css";
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
        <div className={`${style.test} ${className}`}>
            {edit ?
                <div className={style.form}>
                    <Input type="text" name="title" value={formItems.title} onChange={handleChange}
                           className={style.input}/>
                    <Input type="text" name="url" value={formItems.url} onChange={handleChange}
                           className={style.input}/>
                    <Input type="date" name="date_end" value={formItems.date_end} onChange={handleChange}
                           className={style.input}/>
                </div> :
                <div className={style.content}>
                    <div className={style.title}>{test.title}</div>
                    <div className={style.url}>{test.url}</div>
                    <div className={style.date_end}>{convertDate(test.date_end)}</div>
                </div>
            }
            {edit ? <>
                    <IconButton type={"save"} onClick={() => handleUpdate({id: test.id, ...formItems})}
                                className={style.button_save}/>
                    <IconButton type={"close"} onClick={handleEdit} className={style.button_close}/>
                </> :
                <IconButton type={"edit"} onClick={handleEdit} className={style.button_edit}/>
            }
            {!edit &&
                <IconButton type={"delete"} onClick={() => handleDelete(test.id)} className={style.button_delete}/>}
        </div>
    )
}

export default TestChange;
