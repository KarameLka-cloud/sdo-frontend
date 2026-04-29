import { ChangeEvent, FormEvent, JSX, useMemo, useState } from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import Input from "@components/ui/Input/Input.tsx";
import { useNavigate } from "react-router-dom";
import {
  useCreateAdaptationPlanTemplateMutation,
  useDeleteAdaptationPlanTemplateMutation,
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
  const [deleteTemplate] = useDeleteAdaptationPlanTemplateMutation();

  const templates = data as AdaptationPlanTemplateType[];

  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [openedActionsId, setOpenedActionsId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    workSchedule: "5/2",
    shift: 1,
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
    if (!Number.isInteger(form.shift) || form.shift < 1) {
      setStatus("Укажите корректный номер смены.");
      return;
    }
    try {
      await createTemplate({
        name: form.name.trim(),
        work_schedule: form.workSchedule,
        shifts: [form.shift],
      }).unwrap();
      setForm({
        name: "",
        workSchedule: "5/2",
        shift: 1,
      });
      setStatus("Шаблон создан.");
    } catch {
      setStatus("Не удалось создать шаблон.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTemplate(id).unwrap();
      setOpenedActionsId((previous) => (previous === id ? null : previous));
      setStatus("Шаблон удален.");
    } catch {
      setStatus("Не удалось удалить шаблон.");
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
            <label className={styles.fieldLabel}>
              Название шаблона
              <input
                className={styles.input}
                placeholder="Например: Базовый план магазина"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className={styles.fieldLabel}>
              График работы
              <select
                className={styles.input}
                value={form.workSchedule}
                onChange={(e) => setForm({ ...form, workSchedule: e.target.value })}
              >
                <option value="5/2">5/2</option>
                <option value="2/2">2/2</option>
              </select>
            </label>
            <label className={styles.fieldLabel}>
              Смена
              <input
                className={styles.input}
                type="number"
                min={1}
                value={form.shift}
                onChange={(e) =>
                  setForm({ ...form, shift: Number(e.target.value) || 1 })
                }
              />
            </label>
            <button className={styles.createButton} type="submit" disabled={isCreating}>
              {isCreating ? "Создание..." : "Создать план"}
            </button>
          </form>
        )}
        {status && <p className={styles.status}>{status}</p>}
        {isLoading && <p>Загрузка...</p>}
        {isError && <DataMessage type="error" />}
        {!isLoading && !isError && templates.length === 0 && <DataMessage type="noData" />}
        {!isLoading && !isError && templates.length > 0 && (
          <div className={styles.list}>
            {filteredTemplates.map((template) => (
              <div key={template.id} className={styles.card}>
                <button
                  type="button"
                  className={styles.templateButton}
                  onClick={() => navigate(`/admin/adaptation/templates/${template.id}`)}
                >
                  <p className={styles.title}>{template.name}</p>
                  <p className={styles.meta}>График: {template.work_schedule}</p>
                  <p className={styles.meta}>Смены: {template.shifts.join(", ")}</p>
                </button>
                <div className={styles.iconActions}>
                  {openedActionsId === template.id ? (
                    <>
                      <IconButton type="delete" onClick={() => handleDelete(template.id)} />
                      <IconButton type="close" onClick={() => setOpenedActionsId(null)} />
                    </>
                  ) : (
                    <IconButton type="edit" onClick={() => setOpenedActionsId(template.id)} />
                  )}
                </div>
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
