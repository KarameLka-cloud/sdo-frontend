import React, { JSX, useState } from "react";
import styles from "./Webinars.module.css";
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
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
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
    <OverflowScrollBlock>
      <div className={styles.stickyControls}>
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
          <form onSubmit={handleAction} className={styles.form}>
            <Input
              type="text"
              name="title"
              placeholder="Название"
              value={formItems.title}
              onChange={handleChange}
              className={styles.form_input_text}
            />
            <div className={styles.form_date}>
              <Input
                type="date"
                name="date"
                placeholder="Дата"
                value={formItems.date}
                onChange={handleChange}
                className={styles.form_input_date}
              />
              <Input
                type="time"
                name="time_start"
                placeholder="Время начала"
                value={formItems.time_start}
                onChange={handleChange}
                className={styles.form_input_time}
              />
              <Input
                type="time"
                name="time_end"
                placeholder="Время окончания"
                value={formItems.time_end}
                onChange={handleChange}
                className={styles.form_input_time}
              />
            </div>
            <div className={styles.form_actions}>
              <ButtonSubmit loading={addLoading}>Создать</ButtonSubmit>
              <FormActionStatus
                type={createStatusType}
                message={createStatusMessage}
              />
            </div>
          </form>
        ) : null}
      </div>
      <div className={styles.list}>
        <DataList<WebinarType>
          data={filteredData}
          error={!!error}
          isLoading={isLoading}
          renderItem={(item: WebinarType) => (
            <WebinarChange
              key={item.id}
              webinar={item}
              mutationDelete={deleteWebinar}
              className={styles.webinar}
            />
          )}
        />
      </div>
    </OverflowScrollBlock>
  );
}

export default Webinars;
