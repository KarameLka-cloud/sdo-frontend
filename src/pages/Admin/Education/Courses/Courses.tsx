import React, { JSX, useState } from "react";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import Input from "@/components/ui/custom/Input";
import ButtonSubmit from "@/components/ui/custom/ButtonSubmit";
import CourseChange from "@/components/ui/custom/CourseChange";
import DataList from "@/components/ui/custom/DataList";
import { useForm } from "@/hooks/useForm.ts";
import {
  useGetEducationCoursesQuery,
  useAddEducationCourseMutation,
  useDeleteEducationCourseMutation,
} from "@/services/store/features/education.ts";
import Select from "@/components/ui/custom/Select";
import { useGetDepartmentsQuery } from "@/services/store/features/user.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import { useToggle } from "@/hooks/useToggle.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import IconButton from "@/components/ui/custom/IconButton";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import FormActionStatus, {
  type FormActionStatusType,
} from "@/components/ui/custom/FormActionStatus";

function Courses(): JSX.Element {
  const { value: formShow, toggle: handleFormShow } = useToggle();
  const { data, error, isLoading } = useGetEducationCoursesQuery("");
  const [addCourse, { isLoading: addLoading }] =
    useAddEducationCourseMutation();
  const [deleteCourse] = useDeleteEducationCourseMutation();
  const { data: departments } = useGetDepartmentsQuery("");
  const [search, setSearch] = useState("");
  const [createStatusType, setCreateStatusType] =
    useState<FormActionStatusType>("idle");
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
    setCreateStatusMessage(FORM_STATUS_MESSAGES.createLoading);

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
      setCreateStatusMessage(FORM_STATUS_MESSAGES.createSuccess);
    } catch {
      setCreateStatusType("error");
      setCreateStatusMessage(FORM_STATUS_MESSAGES.createError);
    }
  };

  return (
    <OverflowScrollBlock>
      <div className="sticky top-[var(--mfc-sticky-panel-top)] z-[var(--mfc-sticky-panel-z-index)] mb-[var(--mfc-sticky-panel-margin-bottom)] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-[0.8rem] rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-sticky-panel-bg)] p-[var(--mfc-sticky-panel-padding)] max-[900px]:flex-col max-[900px]:items-stretch">
          {formShow ? (
            <IconButton type={"close"} onClick={handleFormShow} />
          ) : (
            <IconButton type={"edit"} onClick={handleFormShow} />
          )}
          <Input
            type={"text"}
            name={"search"}
            placeholder={"🔎"}
            className="w-[40%] max-w-md max-[900px]:w-full max-[900px]:max-w-none"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSearch(e.target.value)
            }
          />
        </div>
        {formShow ? (
          <form
            onSubmit={handleAction}
            className="flex flex-col gap-[0.7rem] rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-create-form-bg)] p-[0.9rem]"
          >
            <Input
              type="text"
              name="title"
              placeholder="Название"
              value={formItems.title}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              type="text"
              name="url"
              placeholder="Ссылка"
              value={formItems.url}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex gap-[0.7rem] max-[900px]:flex-col">
              {departments && (
                <Select
                  name={"department_id"}
                  value={formItems.department_id}
                  onChange={handleChange}
                  data={departments}
                  className="w-[30%] rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm max-[900px]:w-full"
                />
              )}
              <Input
                type="text"
                name="note_department"
                placeholder="Примечание по отделу (опционально)"
                value={formItems.note_department}
                onChange={handleChange}
                className="w-[70%] max-[900px]:w-full"
              />
            </div>
            <Input
              type="date"
              name="date_end"
              placeholder="Пройти до"
              value={formItems.date_end}
              onChange={handleChange}
              className="w-fit"
            />
            <div className="flex items-center gap-3 max-[900px]:flex-col max-[900px]:items-start">
              <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
              <FormActionStatus
                type={createStatusType}
                message={createStatusMessage}
              />
            </div>
          </form>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <DataList<CourseType>
          data={filteredData}
          error={!!error}
          isLoading={isLoading}
          renderItem={(item: CourseType) => (
            <CourseChange
              key={item.id}
              course={item}
              mutationDelete={deleteCourse}
              className="not-first:mt-4"
            />
          )}
        />
      </div>
    </OverflowScrollBlock>
  );
}

export default Courses;
