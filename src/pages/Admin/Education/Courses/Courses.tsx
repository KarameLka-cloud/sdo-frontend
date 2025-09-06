import React from "react";
import {JSX} from "react";
import style from "./Courses.module.css";
import {CourseType} from "../../../../interfaces/api/CourseType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import Input from "../../../../components/ui/Input/Input.tsx";
import ButtonSubmit from "../../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import CourseChange from "../../../../components/ui/CourseChange/CourseChange.tsx";
import ErrorData from "../../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../../components/ui/Loader/Loader.tsx";
import {
    useGetEducationCoursesQuery,
    useAddEducationCourseMutation,
    useUpdateEducationCourseMutation,
    useDeleteEducationCourseMutation,
} from "../../../../services/store/features/education.ts";
import {useForm} from "../../../../hooks/useForm.ts";

function Courses(): JSX.Element {
    const {data: listData, isLoading: listLoading, isError: listError} = useGetEducationCoursesQuery("");
    const [addCourse, {isLoading: addLoading, isError: addError}] = useAddEducationCourseMutation();
    const [updateCourse] = useUpdateEducationCourseMutation();
    const [deleteCourse] = useDeleteEducationCourseMutation();

    const {formItems, setFormItems, handleChange} = useForm({
        title: "",
        url: "",
        date_end: "",
    });

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        await addCourse(formItems).unwrap();
        setFormItems({
            title: "",
            url: "",
            date_end: "",
        })
    };

    return (
        <>
            <ButtonBack/>
            <form onSubmit={handleAction} className={style.form}>
                <Input type="text" name="title" placeholder="Название" value={formItems.title}
                       onChange={handleChange} className={style.form_input_text}/>
                <Input type="text" name="url" placeholder="Ссылка на курс" value={formItems.url}
                       onChange={handleChange} className={style.form_input_text}/>
                <Input type="date" name="date_end" placeholder="Пройти до" value={formItems.date_end}
                       onChange={handleChange} className={style.form_input_date_end}/>
                <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
            </form>
            {addError && (<div>Error</div>)}
            <hr/>
            {listError ? (
                <ErrorData/>
            ) : listLoading ? (
                <Loader/>
            ) : listData && listData.length > 0 ? (
                listData.map((item: CourseType) => {
                    return (
                        <CourseChange key={item.id} course={item} mutationUpdate={updateCourse}
                                      mutationDelete={deleteCourse}
                                      className={style.course}/>
                    )
                })
            ) : <>Курсов нет</>
            }
        </>
    )
}

export default Courses;
