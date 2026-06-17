import React, { JSX, useState } from "react";
import { TestType } from "@/interfaces/api/TestType.ts";
import Input from "@/components/ui/custom/Input";
import ButtonSubmit from "@/components/ui/custom/ButtonSubmit";
import AdminResourceRow from "@/components/ui/custom/AdminResourceRow";
import DataList from "@/components/ui/custom/DataList";
import AdminStickyToolbar from "@/components/ui/custom/AdminStickyToolbar";
import { useForm } from "@/hooks/useForm.ts";
import { useCreateFormStatus } from "@/hooks/useCreateFormStatus.ts";
import Select from "@/components/ui/custom/Select";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useGetPositionsQuery } from "@/services/store/features/user.ts";
import FormActionStatus from "@/components/ui/custom/FormActionStatus";
import convertDate from "@/utils/convertDate.ts";
import {
  useGetEducationTestsQuery,
  useAddEducationTestMutation,
  useDeleteEducationTestMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoTestsQuery,
  useAddEdoTestMutation,
  useDeleteEdoTestMutation,
} from "@/services/store/features/edo.ts";

const EMPTY_FORM = {
  title: "",
  url: "",
  position_id: "",
  note_position: "",
  date_end: "",
};

type Domain = "education" | "edo";

const HOOKS = {
  education: {
    useGetQuery: useGetEducationTestsQuery,
    useAddMutation: useAddEducationTestMutation,
    useDeleteMutation: useDeleteEducationTestMutation,
  },
  edo: {
    useGetQuery: useGetEdoTestsQuery,
    useAddMutation: useAddEdoTestMutation,
    useDeleteMutation: useDeleteEdoTestMutation,
  },
} as const;

function AdminTestsPage({ domain }: { domain: Domain }): JSX.Element {
  const { useGetQuery, useAddMutation, useDeleteMutation } = HOOKS[domain];
  const { data, error, isLoading } = useGetQuery("");
  const [addTest, { isLoading: addLoading }] = useAddMutation();
  const [deleteTest] = useDeleteMutation();
  const { data: positions } = useGetPositionsQuery("");
  const [search, setSearch] = useState("");
  const { type: createStatusType, message: createStatusMessage, submit } =
    useCreateFormStatus();
  const filteredData = useFiltered<TestType>(data, search);

  const { formItems, setFormItems, handleChange } = useForm(EMPTY_FORM);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(
      () => addTest(formItems).unwrap().then(() => undefined),
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
              {positions && (
                <Select
                  name="position_id"
                  value={formItems.position_id}
                  onChange={handleChange}
                  data={positions}
                  className="w-[30%] rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm max-[900px]:w-full"
                />
              )}
              <Input
                type="text"
                name="note_position"
                placeholder="Примечание по должности (опционально)"
                value={formItems.note_position}
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
        <DataList<TestType>
          data={filteredData}
          error={!!error}
          isLoading={isLoading}
          renderItem={(item) => (
            <AdminResourceRow
              key={item.id}
              item={item}
              deleteMessage="Удалить тест?"
              mutationDelete={deleteTest}
              className="not-first:mt-4"
            >
              <span className="block text-base">{item.title}</span>
              <span className="block break-all text-sm text-gray-500">
                {item.url}
              </span>
              <span className="block text-sm italic text-gray-500">
                {item.position}{" "}
                {item.note_position && `(${item.note_position})`}
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

export default AdminTestsPage;
