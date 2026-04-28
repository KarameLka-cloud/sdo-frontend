import React, { JSX, useState } from "react";
import styles from "./Tests.module.css";
import { TestType } from "@interfaces/api/TestType.ts";
import Input from "@components/ui/Input/Input.tsx";
import Select from "@components/ui/Select/Select.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import TestChange from "@components/ui/TestChange/TestChange.tsx";
import DataList from "@components/ui/DataList/DataList.tsx";
import { useForm } from "@hooks/useForm.ts";
import {
  useGetEdoTestsQuery,
  useAddEdoTestMutation,
  useDeleteEdoTestMutation,
  // useUpdateEdoTestMutation
} from "@services/store/features/edo.ts";
import { useGetPositionsQuery } from "@services/store/features/user.ts";
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

function Tests(): JSX.Element {
  const { value: formShow, toggle: handleFormShow } = useToggle();
  const { data, error, isLoading } = useGetEdoTestsQuery("");
  const [addTest, { isLoading: addLoading }] = useAddEdoTestMutation();
  // const [updateTest] = useUpdateEdoTestMutation();
  const [deleteTest] = useDeleteEdoTestMutation();
  const { data: positions } = useGetPositionsQuery("");
  const [search, setSearch] = useState("");
  const [createStatusType, setCreateStatusType] = useState<CreateStatusType>("idle");
  const [createStatusMessage, setCreateStatusMessage] = useState("");
  const filteredData = useFiltered<TestType>(data, search);

  const { formItems, setFormItems, handleChange } = useForm({
    title: "",
    url: "",
    position_id: "",
    note_position: "",
    date_end: "",
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateStatusType("loading");
    setCreateStatusMessage("Создание...");

    try {
      await addTest(formItems).unwrap();
      setFormItems({
        title: "",
        url: "",
        position_id: "",
        note_position: "",
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
      header_name={"Редактирование тестов"}
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
      {formShow && (
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
            <div className={styles.form_position}>
              {positions && (
                <Select
                  name={"position_id"}
                  value={formItems.position_id}
                  onChange={handleChange}
                  data={positions}
                  className={styles.form_select}
                />
              )}
              <Input
                type="text"
                name="note_position"
                placeholder="Примечание по должности (опционально)"
                value={formItems.note_position}
                onChange={handleChange}
                className={styles.form_note_position}
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
      )}

      <DataList<TestType>
        data={filteredData}
        error={!!error}
        isLoading={isLoading}
        renderItem={(item: TestType) => (
          <TestChange
            key={item.id}
            test={item}
            mutationDelete={deleteTest}
            className={styles.test}
          />
        )}
      />
    </OverflowScrollBlock>
  );
}

export default Tests;
