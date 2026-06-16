import React, { JSX, useState } from "react";
import { EventType } from "@/interfaces/api/EventType.ts";
import Input from "@/components/ui/custom/Input";
import Select from "@/components/ui/custom/Select";
import ButtonSubmit from "@/components/ui/custom/ButtonSubmit";
import EventChange from "@/components/ui/custom/EventChange";
import DataList from "@/components/ui/custom/DataList";
import { useForm } from "@/hooks/useForm.ts";
import {
  useGetEducationEventsQuery,
  useAddEducationEventMutation,
  useDeleteEducationEventMutation,
} from "@/services/store/features/education.ts";
import { useGetDepartmentsQuery } from "@/services/store/features/user.ts";
import IconButton from "@/components/ui/custom/IconButton";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useToggle } from "@/hooks/useToggle.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import FormActionStatus, {
  type FormActionStatusType,
} from "@/components/ui/custom/FormActionStatus";

function Events(): JSX.Element {
  const { value: formShow, toggle: handleFormShow } = useToggle();
  const { data, error, isLoading } = useGetEducationEventsQuery("");
  const [addEvent, { isLoading: addLoading }] = useAddEducationEventMutation();
  const [deleteEvent] = useDeleteEducationEventMutation();
  const { data: departments } = useGetDepartmentsQuery("");
  const [search, setSearch] = useState("");
  const [createStatusType, setCreateStatusType] =
    useState<FormActionStatusType>("idle");
  const [createStatusMessage, setCreateStatusMessage] = useState("");
  const filteredData = useFiltered<EventType>(data, search);

  const { formItems, setFormItems, handleChange } = useForm({
    title: "",
    description: "",
    link: "",
    department_id: "",
    note_department: "",
    time: "",
    date: "",
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateStatusType("loading");
    setCreateStatusMessage(FORM_STATUS_MESSAGES.createLoading);

    try {
      await addEvent(formItems).unwrap();
      setFormItems({
        title: "",
        description: "",
        link: "",
        department_id: "",
        note_department: "",
        time: "",
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
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <DataList<EventType>
          data={filteredData}
          error={!!error}
          isLoading={isLoading}
          renderItem={(item: EventType) => (
            <EventChange
              key={item.id}
              event={item}
              mutationDelete={deleteEvent}
              className="not-first:mt-4"
            />
          )}
        />
      </div>
    </>
  );
}

export default Events;
