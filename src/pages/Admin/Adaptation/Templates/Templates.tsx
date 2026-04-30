import { ChangeEvent, FormEvent, JSX, useMemo, useState } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import Input from "@components/ui/Input/Input.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import Loader from "@components/ui/Loader/Loader.tsx";
import { useNavigate } from "react-router-dom";
import {
  useCreateAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplatesQuery,
} from "@services/store/features/user.ts";
import styles from "./Templates.module.css";

interface AdaptationPlanTemplateType {
  id: number;
  name: string;
  work_schedule: string;
  shifts: number[];
}

function Templates(): JSX.Element {
  const navigate = useNavigate();
  const { data = [], isLoading, isError } = useGetAdaptationPlanTemplatesQuery(undefined);
  const [createTemplate, { isLoading: isCreating }] =
    useCreateAdaptationPlanTemplateMutation();

  const templates = data as AdaptationPlanTemplateType[];

  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    workSchedule: "",
    shift: "",
  });
  const hasSearch = search.trim().length > 0;
  const filteredTemplates = useMemo(() => {
    if (!hasSearch) {
      return templates;
    }

    const searchLower = search.toLowerCase();
    return templates.filter((template) => {
      const templateName = template.name.toLowerCase();
      const workSchedule = template.work_schedule.toLowerCase();
      const shifts = template.shifts.join(",");
      return (
        templateName.includes(searchLower) ||
        workSchedule.includes(searchLower) ||
        shifts.includes(searchLower)
      );
    });
  }, [hasSearch, search, templates]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setStatus("Укажите название шаблона.");
      return;
    }
    if (!form.workSchedule) {
      setStatus("Выберите график работы.");
      return;
    }
    if (!form.shift) {
      setStatus("Укажите корректный номер смены.");
      return;
    }
    try {
      await createTemplate({
        name: form.name.trim(),
        work_schedule: form.workSchedule,
        shifts: [Number(form.shift)],
      }).unwrap();
      setForm({
        name: "",
        workSchedule: "",
        shift: "",
      });
      setStatus("Шаблон создан.");
    } catch {
      setStatus("Не удалось создать шаблон.");
    }
  };

  return (
    <OverflowScrollBlock header_name={"Шаблоны адаптации"}>
      <div className={styles.container}>
        <div className={styles.toolbar}>
          {isCreateVisible ? (
            <IconButton type="close" onClick={() => setIsCreateVisible(false)} />
          ) : (
            <IconButton type="edit" onClick={() => setIsCreateVisible(true)} />
          )}
          <Input
            type={"text"}
            name={"search"}
            placeholder={"🔎"}
            className={styles.searchInput}
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setSearch(event.target.value)
            }
          />
        </div>
        {isCreateVisible && (
          <form className={styles.form} onSubmit={handleCreate}>
            <div className={styles.field}>
              <Input
                type="text"
                name="name"
                className={styles.input}
                placeholder="Название шаблона"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <select
                className={styles.input}
                value={form.workSchedule}
                onChange={(e) => setForm({ ...form, workSchedule: e.target.value })}
              >
                <option value="" disabled>
                  График работы
                </option>
                <option value="5/2">5/2</option>
                <option value="2/2">2/2</option>
              </select>
            </div>
            <div className={styles.field}>
              <Input
                type="number"
                name="shift"
                min={1}
                step={1}
                className={styles.input}
                placeholder="Смена"
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
              />
            </div>
            <ButtonSubmit loading={isCreating} className={styles.submitButton}>
              Создать
            </ButtonSubmit>
          </form>
        )}
        {status && <p className={styles.status}>{status}</p>}
        {isLoading && <Loader />}
        {isError && <DataMessage type="error" />}
        {!isLoading && !isError && templates.length === 0 && <DataMessage type="noData" />}
        {!isLoading && !isError && templates.length > 0 && (
          <div className={styles.list}>
            {filteredTemplates.map((template) => (
              <div key={template.id} className={styles.card}>
                <div className={styles.templateInfo}>
                  <p className={styles.title}>{template.name}</p>
                  <p className={styles.meta}>График: {template.work_schedule}</p>
                  <p className={styles.meta}>Смены: {template.shifts.join(", ")}</p>
                </div>
                <IconButton
                  type="edit"
                  onClick={() => navigate(`/admin/adaptation/templates/${template.id}`)}
                  className={styles.editButton}
                />
              </div>
            ))}
            {hasSearch && filteredTemplates.length === 0 && (
              <p className={styles.searchEmpty}>Шаблон "{search}" не найден</p>
            )}
          </div>
        )}
      </div>
    </OverflowScrollBlock>
  );
}

export default Templates;
