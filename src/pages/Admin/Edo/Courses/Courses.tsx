import {JSX, useState} from "react";
import style from "./Courses.module.css";
import {CourseType} from "../../../../types/components/CourseType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import InputText from "../../../../components/ui/InputText/InputText.tsx";
import InputDate from "../../../../components/ui/InputDate/InputDate.tsx";
import ButtonSubmit from "../../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import CourseChange from "../../../../components/ui/CourseChange/CourseChange.tsx";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import {
    useGetEdoCoursesQuery,
    useAddEdoCourseMutation,
    useDeleteEdoCourseMutation
} from "../../../../services/store/features/edo.ts";

function Courses(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEdoCoursesQuery("");
    const [addEdoCourse, {isLoading: addLoading, isError: addError}] = useAddEdoCourseMutation();
    const [deleteEdoCourse] = useDeleteEdoCourseMutation();

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

    const handleAddEdoCourse = async (e: any) => {
        e.preventDefault();
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
            <form onSubmit={handleAddEdoCourse} className={style.form}>
                <InputText type="text" name="title" placeholder="Название" value={formData.title}
                           onChange={handleChange} className={style.form_input_text}/>
                <InputText type="text" name="url" placeholder="Ссылка на курс" value={formData.url}
                           onChange={handleChange} className={style.form_input_text}/>
                <InputDate type="date" name="date_end" placeholder="Пройти до" value={formData.date_end}
                           onChange={handleChange}
                           className={style.form_input_date_end}/>
                <ButtonSubmit loading={addLoading} className={style.button_create}>Создать</ButtonSubmit>
            </form>
            <hr/>
            {listError ? (
                <ErrorData/>
            ) : listLoading ? (
                <Loader/>
            ) : listData && listData.length > 0 ? (
                listData.map((item: CourseType) => {
                    return (
                        <CourseChange key={item.id} course={item} mutation={deleteEdoCourse} className={style.course}/>
                    )
                })
            ) : <>Курсов нет</>
            }
        </>
    )
}

export default Courses;
