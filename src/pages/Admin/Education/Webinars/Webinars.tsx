import React, { JSX, useState } from "react";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import Input from "@/components/ui/custom/Input";
import WebinarChange from "@/components/ui/custom/WebinarChange";
import ButtonSubmit from "@/components/ui/custom/ButtonSubmit";
import DataList from "@/components/ui/custom/DataList";
import { useForm } from "@/hooks/useForm.ts";
import {
  useGetEducationWebinarsQuery,
  useAddEducationWebinarMutation,
  useDeleteEducationWebinarMutation,
} from "@/services/store/features/education.ts";
import IconButton from "@/components/ui/custom/IconButton";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useToggle } from "@/hooks/useToggle.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import FormActionStatus, {
  type FormActionStatusType,
} from "@/components/ui/custom/FormActionStatus";

function Webinars(): JSX.Element {
  const { value: formShow, toggle: handleFormShow } = useToggle();
  const { data, error, isLoading } = useGetEducationWebinarsQuery("");
  const [addWebinar, { isLoading: addLoading }] =
    useAddEducationWebinarMutation();
  const [deleteWebinar] = useDeleteEducationWebinarMutation();
  const [search, setSearch] = useState("");
  const [createStatusType, setCreateStatusType] =
    useState<FormActionStatusType>("idle");
  const [createStatusMessage, setCreateStatusMessage] = useState("");
  const filteredData = useFiltered<WebinarType>(data, search);

  const { formItems, setFormItems, handleChange } = useForm({
    title: "",
    time_start: "",
    time_end: "",
    date: "",
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateStatusType("loading");
    setCreateStatusMessage(FORM_STATUS_MESSAGES.createLoading);

    try {
      await addWebinar(formItems).unwrap();
      setFormItems({
        title: "",
        time_start: "",
        time_end: "",
        date: "",
      });
      setCreateStatusType("success");
      setCreateStatusMessage(FORM_STATUS_MESSAGES.createSuccess);
    } catch {
      setCreateStatusType("error");
      setCreateStatusMessage(FORM_STATUS_MESSAGES.createError);
    }
  };

  return (
    <>
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
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <DataList<WebinarType>
          data={filteredData}
          error={!!error}
          isLoading={isLoading}
          renderItem={(item: WebinarType) => (
            <WebinarChange
              key={item.id}
              webinar={item}
              mutationDelete={deleteWebinar}
              className="not-first:mt-4"
            />
          )}
        />
      </div>
    </>
  );
}

export default Webinars;
