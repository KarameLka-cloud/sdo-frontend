import {TestType} from "../../../types/components/TestType.ts";
import {useForm} from "../../../hooks/useForm.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useDelete} from "../../../hooks/useDelete.ts";
import style from "./TestChange.module.css";
import convertDate from "../../../utils/convertDate.ts";
import icon_trash from "../../../assets/images/icons/trash.svg";
import {JSX} from "react";


type TestProps = {
    className?: string;
    test: TestType;
    mutation: any;
}

function TestChange({className, test, mutation}: TestProps): JSX.Element {
    const {formItems, handleChange} = useForm({
        title: test.title,
        url: test.url,
        date_end: test.date_end,
    });
    const {value: edit, toggle: handleEdit} = useToggle();
    const handleDelete = useDelete(mutation, "Удалить курс?");

    return (
        <div className={`${style.test} ${className}`}>
            {edit ?
                <div className={style.content}>
                    <input type="text" name="title" value={formItems.title} onChange={handleChange}/>
                    <input type="text" name="url" value={formItems.url} onChange={handleChange}/>
                    <input type="date" name="date_end" value={formItems.date_end} onChange={handleChange}/>
                </div> :
                <div className={style.content}>
                    <div className={style.title}>{test.title}</div>
                    <div className={style.url}>{test.url}</div>
                    <div className={style.date_end}>{convertDate(test.date_end)}</div>
                </div>
            }
            <div onClick={handleEdit} className={style.delete_button}>
                <img src={icon_trash} alt="Кнопка редактировать"/>
            </div>
            <div onClick={() => handleDelete(test.id)} className={style.delete_button}>
                <img src={icon_trash} alt="Кнопка удалить"/>
            </div>
        </div>
    )
}

export default TestChange;
