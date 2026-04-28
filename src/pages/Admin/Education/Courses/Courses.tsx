import React, { JSX, useState } from "react";
import styles from "./Courses.module.css";
import { CourseType } from "@interfaces/api/CourseType.ts";
import Input from "@components/ui/Input/Input.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import CourseChange from "@components/ui/CourseChange/CourseChange.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";
import { useForm } from "@hooks/useForm.ts";
import {
  useGetEducationCoursesQuery,
  useAddEducationCourseMutation,
  // useUpdateEducationCourseMutation,
  useDeleteEducationCourseMutation,
} from "@services/store/features/education.ts";
import Select from "@components/ui/Select/Select.tsx";
import { useGetDepartmentsQuery } from "@services/store/features/user.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import { useToggle } from "@hooks/useToggle.ts";
import { useFiltered } from "@hooks/useFiltered.ts";
import IconButton from "@components/ui/IconButton/IconButton.tsx";

type CreateStatusType = "idle" | "loading" | "success" | "error";

interface ApiError {
  data?: {
    message?: string;
  };
}

function Courses(): JSX.Element {
  const { value: formShow, toggle: handleFormShow } = useToggle();
  const { data, error, isLoading } = useGetEducationCoursesQuery("");
  const [addCourse, { isLoading: addLoading }] = useAddEducationCourseMutation();
  // const [updateCourse] = useUpdateEducationCourseMutation();
  const [deleteCourse] = useDeleteEducationCourseMutation();
  const { data: departments } = useGetDepartmentsQuery("");
  const [search, setSearch] = useState("");
  const [createStatusType, setCreateStatusType] = useState<CreateStatusType>("idle");
  const [createStatusMessage, setCreateStatusMessage] = useState("");
  const filteredData = useFiltered<CourseType>(data, search);

  const { formItems, setFormItems, handleChange } = useForm({
    title: "",
    url: "",
    department_id: "",
    note_department: "",
    date_end: "",
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateStatusType("loading");
    setCreateStatusMessage("Создание...");

    try {
      await addCourse(formItems).unwrap();
      setFormItems({
        title: "",
        url: "",
        department_id: "",
        note_department: "",
        date_end: "",
      });
      setCreateStatusType("success");
      setCreateStatusMessage("Создано");
    } catch (createError: unknown) {
      const apiError = createError as ApiError;
      setCreateStatusType("error");
      setCreateStatusMessage(
        apiError.data?.message ?? "Не удалось создать запись. Попробуйте снова.",
      );
    }
  };

  return (
    <OverflowScrollBlock
      header_name={"Редактирование эл. курсов"}
      button_back_visible={"enable"}
    >
      <div className={styles.create_search}>
        {formShow ? (
          <IconButton type={"close"} onClick={handleFormShow} />
        ) : (
          <IconButton type={"edit"} onClick={handleFormShow} />
        )}
        <Input
          type={"text"}
          name={"search"}
          placeholder={"🔎"}
          className={styles.input_search}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSearch(e.target.value)
          }
        />
      </div>
      {formShow ? (
        <>
          <form onSubmit={handleAction} className={styles.form}>
            <Input
              type="text"
              name="title"
              placeholder="Название"
              value={formItems.title}
              onChange={handleChange}
              className={styles.form_input_text}
            />
            <Input
              type="text"
              name="url"
              placeholder="Ссылка"
              value={formItems.url}
              onChange={handleChange}
              className={styles.form_input_text}
            />
            <div className={styles.form_department}>
              {departments && (
                <Select
                  name={"department_id"}
                  value={formItems.department_id}
                  onChange={handleChange}
                  data={departments}
                  className={styles.form_select}
                />
              )}
              <Input
                type="text"
                name="note_department"
                placeholder="Примечание по отделу (опционально)"
                value={formItems.note_department}
                onChange={handleChange}
                className={styles.form_note_department}
              />
            </div>
            <Input
              type="date"
              name="date_end"
              placeholder="Пройти до"
              value={formItems.date_end}
              onChange={handleChange}
              className={styles.form_input_date_end}
            />
            <div className={styles.form_actions}>
              <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
              {createStatusType !== "idle" && (
                <span
                  className={`${styles.create_status} ${
                    createStatusType === "error"
                      ? styles.create_status_error
                      : createStatusType === "success"
                        ? styles.create_status_success
                        : styles.create_status_loading
                  }`}
                >
                  {createStatusMessage}
                </span>
              )}
            </div>
          </form>
        </>
      ) : null}

      <DataList<CourseType>
        data={filteredData}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: CourseType) => (
          <CourseChange
            key={item.id}
            course={item}
            mutationDelete={deleteCourse}
            className={styles.course}
          />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Courses;
