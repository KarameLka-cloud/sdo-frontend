import React, { JSX, useState } from "react";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import Input from "@/components/ui/custom/Input";
import ButtonSubmit from "@/components/ui/custom/ButtonSubmit";
import AdminResourceRow from "@/components/ui/custom/AdminResourceRow";
import DataList from "@/components/ui/custom/DataList";
import AdminStickyToolbar from "@/components/ui/custom/AdminStickyToolbar";
import { useForm } from "@/hooks/useForm.ts";
import { useCreateFormStatus } from "@/hooks/useCreateFormStatus.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import FormActionStatus from "@/components/ui/custom/FormActionStatus";
import convertDate from "@/utils/convertDate.ts";
import { convertTime } from "@/utils/convertTime.ts";
import {
  useGetEducationWebinarsQuery,
  useAddEducationWebinarMutation,
  useDeleteEducationWebinarMutation,
} from "@/services/store/features/education.ts";

const EMPTY_FORM = {
  title: "",
  time_start: "",
  time_end: "",
  date: "",
};

function AdminWebinarsPage(): JSX.Element {
  const { data, error, isLoading } = useGetEducationWebinarsQuery("");
  const [addWebinar, { isLoading: addLoading }] =
    useAddEducationWebinarMutation();
  const [deleteWebinar] = useDeleteEducationWebinarMutation();
  const [search, setSearch] = useState("");
  const { type: createStatusType, message: createStatusMessage, submit } =
    useCreateFormStatus();
  const filteredData = useFiltered<WebinarType>(data, search);

  const { formItems, setFormItems, handleChange } = useForm(EMPTY_FORM);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(
      () => addWebinar(formItems).unwrap().then(() => undefined),
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
            <div className="flex gap-[0.7rem] max-[900px]:flex-col">
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
                name="time_start"
                placeholder="Время начала"
                value={formItems.time_start}
                onChange={handleChange}
                className="w-fit"
              />
              <Input
                type="time"
                name="time_end"
                placeholder="Время окончания"
                value={formItems.time_end}
                onChange={handleChange}
                className="w-fit"
              />
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
        <DataList<WebinarType>
          data={filteredData}
          error={!!error}
          isLoading={isLoading}
          renderItem={(item) => (
            <AdminResourceRow
              key={item.id}
              item={item}
              deleteMessage="Удалить вебинар?"
              mutationDelete={deleteWebinar}
              className="not-first:mt-4"
            >
              <span className="text-base block">{item.title}</span>
              <span className="text-sm text-gray-900 block">
                {`${convertDate(item.date)} | ${convertTime(item.time_start)}-${convertTime(item.time_end)}`}
              </span>
            </AdminResourceRow>
          )}
        />
      </div>
    </>
  );
}

export default AdminWebinarsPage;
