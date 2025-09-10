import React, {JSX} from "react";
import styles from "./Courses.module.css";
import {CourseType} from "../../../../interfaces/api/CourseType.ts";
import ButtonBack from "../../../../components/ui/ButtonBack/ButtonBack.tsx";
import Input from "../../../../components/ui/Input/Input.tsx";
import ButtonSubmit from "../../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import CourseChange from "../../../../components/ui/CourseChange/CourseChange.tsx";
import DataList from "../../../../components/ui/DataList/DataList.tsx";
import {useForm} from "../../../../hooks/useForm.ts";
import {
    useGetEdoCoursesQuery,
    useAddEdoCourseMutation,
    useUpdateEdoCourseMutation,
    useDeleteEdoCourseMutation
} from "../../../../services/store/features/edo.ts";

function Courses(): JSX.Element {
    const {data, error, isLoading} = useGetEdoCoursesQuery("");
    const [addCourse, {isLoading: addLoading, isError: addError}] = useAddEdoCourseMutation();
    const [updateCourse] = useUpdateEdoCourseMutation();
    const [deleteCourse] = useDeleteEdoCourseMutation();

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
            <form onSubmit={handleAction} className={styles.form}>
                <Input type="text" name="title" placeholder="Название" value={formItems.title}
                       onChange={handleChange} className={styles.form_input_text}/>
                <Input type="text" name="url" placeholder="Ссылка на курс" value={formItems.url}
                       onChange={handleChange} className={styles.form_input_text}/>
                <Input type="date" name="date_end" placeholder="Пройти до" value={formItems.date_end}
                       onChange={handleChange} className={styles.form_input_date_end}/>
                <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
            </form>
            {addError && (<div>Error</div>)}
            <hr/>
            <DataList<CourseType>
                data={data}
                error={!!error}
                isLoading={isLoading}
                renderItem={(item: CourseType) => (
                    <CourseChange key={item.id} course={item} mutationUpdate={updateCourse}
                                  mutationDelete={deleteCourse}
                                  className={styles.course}/>
                )}
            />
        </>
    )
}

export default Courses;
