import React, { JSX, useState } from "react";
import { EventType } from "@/interfaces/api/EventType.ts";
import Input from "@/components/ui/custom/Input";
import Select from "@/components/ui/custom/Select";
import ButtonSubmit from "@/components/ui/custom/ButtonSubmit";
import AdminResourceRow from "@/components/ui/custom/AdminResourceRow";
import DataList from "@/components/ui/custom/DataList";
import AdminStickyToolbar from "@/components/ui/custom/AdminStickyToolbar";
import { useForm } from "@/hooks/useForm.ts";
import { useCreateFormStatus } from "@/hooks/useCreateFormStatus.ts";
import { useGetDepartmentsQuery } from "@/services/store/features/user.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import FormActionStatus from "@/components/ui/custom/FormActionStatus";
import convertDate from "@/utils/convertDate.ts";
import { convertTime } from "@/utils/convertTime.ts";
import {
  useGetEducationEventsQuery,
  useAddEducationEventMutation,
  useDeleteEducationEventMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoEventsQuery,
  useAddEdoEventMutation,
  useDeleteEdoEventMutation,
} from "@/services/store/features/edo.ts";

const EMPTY_FORM = {
  title: "",
  description: "",
  link: "",
  department_id: "",
  note_department: "",
  time: "",
  date: "",
};

type Domain = "education" | "edo";

const HOOKS = {
  education: {
    useGetQuery: useGetEducationEventsQuery,
    useAddMutation: useAddEducationEventMutation,
    useDeleteMutation: useDeleteEducationEventMutation,
  },
  edo: {
    useGetQuery: useGetEdoEventsQuery,
    useAddMutation: useAddEdoEventMutation,
    useDeleteMutation: useDeleteEdoEventMutation,
  },
} as const;

function AdminEventsPage({ domain }: { domain: Domain }): JSX.Element {
  const { useGetQuery, useAddMutation, useDeleteMutation } = HOOKS[domain];
  const { data, error, isLoading } = useGetQuery("");
  const [addEvent, { isLoading: addLoading }] = useAddMutation();
  const [deleteEvent] = useDeleteMutation();
  const { data: departments } = useGetDepartmentsQuery("");
  const [search, setSearch] = useState("");
  const { type: createStatusType, message: createStatusMessage, submit } =
    useCreateFormStatus();
  const filteredData = useFiltered<EventType>(data, search);

  const { formItems, setFormItems, handleChange } = useForm(EMPTY_FORM);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(
      () => addEvent(formItems).unwrap().then(() => undefined),
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
              name="description"
              placeholder="Описание"
              value={formItems.description}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              type="text"
              name="link"
              placeholder="Ссылка на доп. материалы (опционально)"
              value={formItems.link}
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
            <div className="flex items-center gap-[0.7rem] max-[900px]:flex-col max-[900px]:items-stretch">
              <Input
                type="date"
                name="date"
                placeholder="Дата"
                value={formItems.date}
                onChange={handleChange}
                className="w-fit"
              />
              <Input
                type="time"
                name="time"
                placeholder="Время"
                value={formItems.time}
                onChange={handleChange}
                className="w-fit"
              />
              <span className="shrink-0 text-sm whitespace-nowrap text-[var(--mfc-gray-color)]">
                &nbsp;Время (опционально)
              </span>
            </div>
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
        <DataList<EventType>
          data={filteredData}
          error={!!error}
          isLoading={isLoading}
          renderItem={(item) => (
            <AdminResourceRow
              key={item.id}
              item={item}
              deleteMessage="Удалить мероприятие?"
              mutationDelete={deleteEvent}
              className="not-first:mt-4"
            >
              <span className="block text-base">{item.title}</span>
              <span className="block text-sm text-gray-500">{item.description}</span>
              {item.link && (
                <span className="block break-all text-sm text-gray-500">
                  {item.link}
                </span>
              )}
              <span className="block text-sm italic text-gray-500">
                {item.department}{" "}
                {item.note_department && `(${item.note_department})`}
              </span>
              <span className="block text-sm text-gray-900">
                {convertDate(item.date)}{" "}
                {item.time && `| ${convertTime(item.time)}`}
              </span>
            </AdminResourceRow>
          )}
        />
      </div>
    </>
  );
}

export default AdminEventsPage;
