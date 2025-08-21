import {TestType} from "../../../types/components/TestType.ts";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useDelete} from "../../../hooks/useDelete.ts";
import style from "./TestChange.module.css";
import InputText from "../InputText/InputText.tsx";
import InputDate from "../InputDate/InputDate.tsx";
import convertDate from "../../../utils/convertDate.ts";
import {JSX} from "react";
import ButtonDelete from "../ButtonDelete/ButtonDelete.tsx";
import ButtonEdit from "../ButtonEdit/ButtonEdit.tsx";
import ButtonSave from "../ButtonSave/ButtonSave.tsx";
import ButtonClose from "../ButtonClose/ButtonClose.tsx";
import {useUpdate} from "../../../hooks/useUpdate.ts";


type TestProps = {
    className?: string;
    test: TestType;
    mutationUpdate: any;
    mutationDelete: any;
}

function TestChange({className, test, mutationUpdate, mutationDelete}: TestProps): JSX.Element {
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
                    <InputText type="text" name="title" value={formItems.title} onChange={handleChange}
                               className={style.input}/>
                    <InputText type="text" name="url" value={formItems.url} onChange={handleChange}
                               className={style.input}/>
                    <InputDate type="date" name="date_end" value={formItems.date_end} onChange={handleChange}
                               className={style.input}/>
                </div> :
                <div className={style.content}>
                    <div className={style.title}>{test.title}</div>
                    <div className={style.url}>{test.url}</div>
                    <div className={style.date_end}>{convertDate(test.date_end)}</div>
                </div>
            }
            {edit &&
                <ButtonSave onClick={() => handleUpdate({id: test.id, ...formItems})} className={style.button_save}/>}
            {edit ? <ButtonClose onClick={handleEdit} className={style.button_close}/> :
                <ButtonEdit onClick={handleEdit} className={style.button_edit}/>}
            {!edit && <ButtonDelete onClick={() => handleDelete(test.id)} className={style.button_delete}/>}
        </div>
    )
}

export default TestChange;
