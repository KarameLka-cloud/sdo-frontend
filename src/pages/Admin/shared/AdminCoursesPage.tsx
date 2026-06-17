import React, { JSX, useState } from "react";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import Input from "@/components/ui/custom/Input";
import ButtonSubmit from "@/components/ui/custom/ButtonSubmit";
import AdminResourceRow from "@/components/ui/custom/AdminResourceRow";
import DataList from "@/components/ui/custom/DataList";
import AdminStickyToolbar from "@/components/ui/custom/AdminStickyToolbar";
import { useForm } from "@/hooks/useForm.ts";
import { useCreateFormStatus } from "@/hooks/useCreateFormStatus.ts";
import Select from "@/components/ui/custom/Select";
import { useGetDepartmentsQuery } from "@/services/store/features/user.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import FormActionStatus from "@/components/ui/custom/FormActionStatus";
import convertDate from "@/utils/convertDate.ts";
import {
  useGetEducationCoursesQuery,
  useAddEducationCourseMutation,
  useDeleteEducationCourseMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoCoursesQuery,
  useAddEdoCourseMutation,
  useDeleteEdoCourseMutation,
} from "@/services/store/features/edo.ts";

const EMPTY_FORM = {
  title: "",
  url: "",
  department_id: "",
  note_department: "",
  date_end: "",
};

type Domain = "education" | "edo";

const HOOKS = {
  education: {
    useGetQuery: useGetEducationCoursesQuery,
    useAddMutation: useAddEducationCourseMutation,
    useDeleteMutation: useDeleteEducationCourseMutation,
  },
  edo: {
    useGetQuery: useGetEdoCoursesQuery,
    useAddMutation: useAddEdoCourseMutation,
    useDeleteMutation: useDeleteEdoCourseMutation,
  },
} as const;

function AdminCoursesPage({ domain }: { domain: Domain }): JSX.Element {
  const { useGetQuery, useAddMutation, useDeleteMutation } = HOOKS[domain];
  const { data, error, isLoading } = useGetQuery("");
  const [addCourse, { isLoading: addLoading }] = useAddMutation();
  const [deleteCourse] = useDeleteMutation();
  const { data: departments } = useGetDepartmentsQuery("");
  const [search, setSearch] = useState("");
  const { type: createStatusType, message: createStatusMessage, submit } =
    useCreateFormStatus();
  const filteredData = useFiltered<CourseType>(data, search);

  const { formItems, setFormItems, handleChange } = useForm(EMPTY_FORM);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(
      () => addCourse(formItems).unwrap().then(() => undefined),
      () => setFormItems(EMPTY_FORM),
    );
  };

  return (
    <>
      <AdminStickyToolbar
        search={search}
        onSearchChange={setSearch}
        form={
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
                  name="department_id"
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
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <DataList<CourseType>
          data={filteredData}
          error={!!error}
          isLoading={isLoading}
          renderItem={(item) => (
            <AdminResourceRow
              key={item.id}
              item={item}
              deleteMessage="Удалить курс?"
              mutationDelete={deleteCourse}
              className="not-first:mt-4"
            >
              <span className="block text-base">{item.title}</span>
              <span className="block break-all text-sm text-gray-500">
                {item.url}
              </span>
              <span className="block text-sm italic text-gray-500">
                {item.department}{" "}
                {item.note_department && `(${item.note_department})`}
              </span>
              <span className="block text-sm text-gray-900">
                {convertDate(item.date_end)}
              </span>
            </AdminResourceRow>
          )}
        />
      </div>
    </>
  );
}

export default AdminCoursesPage;
