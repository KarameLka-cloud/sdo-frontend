import {JSX, useState} from "react";
import style from "./Courses.module.css";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import InputText from "../../../../components/ui/InputText/InputText.tsx";
import {
    useGetEdoCoursesQuery,
    useAddEdoCourseMutation,
    // useDeleteEdoCourseMutation
} from "../../../../services/store/features/edoApi.ts";

function Courses(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEdoCoursesQuery("");
    const [addEdoCourse, {isLoading: addLoading, isError: addError}] = useAddEdoCourseMutation();
    // const [deleteEdoCourse] = useDeleteEdoCourseMutation();

    const [formData, setFormData] = useState({
        title: "",
        url: "",
        date_end: ""
    });

    const handleChange = (e: {
        target: { name: string; value: string };
    }): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const handleAddEdoCourse = async () => {
        await addEdoCourse(formData).unwrap();
        setFormData({
            title: "",
            url: "",
            date_end: ""
        });
    };

    return (
        <>
            <ButtonBack/>
            <div className={style.form}>
                {addError ? (<>Error</>) : addLoading ? (<>Loading...</>) : null}
                <InputText type="text" name="title" placeholder="Название" value={formData.title}
                           onChange={handleChange} className={style.form_input}/>
                <InputText type="text" name="url" placeholder="Ссылка на курс" value={formData.url}
                           onChange={handleChange} className={style.form_input}/>
                <input type="date" name="date_end" placeholder="Пройти до" value={formData.date_end} onChange={handleChange}
                       className={style.form_input_date_end}/>
                <button onClick={handleAddEdoCourse} className={style.button_create}>Создать</button>
            </div>
            <hr/>
            {listError ? (
                <>Ошибка загрузки</>
            ) : listLoading ? (
                <>Загрузка...</>
            ) : listData && listData.length > 0 ? (
                listData.map((item: {title: string, url: string, date_end: string}) => {
                    return (
                        <>
                            <div>{item.title}</div>
                            <div>{item.url}</div>
                            <div>{item.date_end}</div>
                        </>
                    )
                })
            ) : <>Курсов нет</>
            }
        </>
    )
}

export default Courses;
