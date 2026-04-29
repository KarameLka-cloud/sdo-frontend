import { JSX, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import IconButton from "@components/ui/IconButton/IconButton.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import {
  useGetAdaptationPlanTemplatesQuery,
  useUpdateAdaptationPlanTemplateMutation,
} from "@services/store/features/user.ts";
import styles from "./TemplateTasks.module.css";

type ResponsibleRole =
  | "Руководитель отдела"
  | "Наставник"
  | "Сотрудник УПиПК";

interface TaskRule {
  description: string;
  responsible_role: ResponsibleRole;
  day_from?: number | null;
  day_to?: number | null;
  links: string[];
}

interface AdaptationPlanTemplateType {
  id: number;
  name: string;
  work_schedule: string;
  shifts: number[];
  task_blueprint?: TaskRule[];
}

interface TaskRuleForm {
  description: string;
  responsible_role: ResponsibleRole;
  day_from?: string;
  day_to?: string;
  links: string;
}

interface GroupedRuleBlock {
  key: string;
  title: string;
  dayFrom: string;
  dayTo: string;
  items: Array<{ rule: TaskRuleForm; index: number }>;
}

const EMPTY_RULE: TaskRuleForm = {
  description: "",
  responsible_role: "Наставник",
  links: "",
};

function toFormRule(rule: TaskRule): TaskRuleForm {
  return {
    description: rule.description,
    responsible_role: rule.responsible_role,
    day_from: rule.day_from ? String(rule.day_from) : "",
    day_to: rule.day_to ? String(rule.day_to) : "",
    links: (rule.links ?? []).join(", "),
  };
}

function toPayloadRule(rule: TaskRuleForm): TaskRule {
  return {
    description: rule.description.trim(),
    responsible_role: rule.responsible_role,
    day_from: rule.day_from ? Number(rule.day_from) : null,
    day_to: rule.day_to ? Number(rule.day_to) : null,
    links: rule.links
      .split(",")
      .map((link) => link.trim())
      .filter(Boolean),
  };
}

function TemplateTasks(): JSX.Element {
  const params = useParams();
  const templateId = Number(params.templateId);
  const { data = [], isLoading, isError } = useGetAdaptationPlanTemplatesQuery(undefined);
  const [updateTemplate, { isLoading: isSaving }] = useUpdateAdaptationPlanTemplateMutation();
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [createRules, setCreateRules] = useState<TaskRuleForm[]>([{ ...EMPTY_RULE }]);
  const [createDayFrom, setCreateDayFrom] = useState<string>("");
  const [createDayTo, setCreateDayTo] = useState<string>("");
  const [editingGroupKey, setEditingGroupKey] = useState<string | null>(null);
  const [editingGroupRules, setEditingGroupRules] = useState<TaskRuleForm[]>([]);
  const [editingGroupIndexes, setEditingGroupIndexes] = useState<number[]>([]);
  const [editingGroupDayFrom, setEditingGroupDayFrom] = useState<string>("");
  const [editingGroupDayTo, setEditingGroupDayTo] = useState<string>("");
  const [status, setStatus] = useState("");

  const templates = data as AdaptationPlanTemplateType[];
  const template = useMemo(
    () => templates.find((item) => item.id === templateId),
    [templates, templateId],
  );

  const rules = useMemo(
    () => (template?.task_blueprint ?? []).map((item) => toFormRule(item)),
    [template],
  );

  const groupedRules = useMemo<GroupedRuleBlock[]>(() => {
    const map = new Map<string, GroupedRuleBlock>();

    rules.forEach((rule, index) => {
      const dayFrom = rule.day_from || "";
      const dayTo = rule.day_to || "";
      const key = `${dayFrom}:${dayTo}`;

      if (!map.has(key)) {
        const title = dayFrom
          ? dayTo
            ? `Дни ${dayFrom}-${dayTo}`
            : `День ${dayFrom}`
          : "Все дни";
        map.set(key, { key, title, dayFrom, dayTo, items: [] });
      }

      map.get(key)?.items.push({ rule, index });
    });

    return Array.from(map.values());
  }, [rules]);

  const saveRules = async (nextRules: TaskRuleForm[]) => {
    if (!template) {
      return;
    }

    const payloadRules = nextRules
      .map(toPayloadRule)
      .filter((rule) => rule.description.length > 0);

    await updateTemplate({
      id: template.id,
      name: template.name,
      work_schedule: template.work_schedule,
      shifts: template.shifts,
      task_blueprint: payloadRules,
    }).unwrap();
  };

  const addCreateRule = () => {
    setCreateRules((previous) => [...previous, { ...EMPTY_RULE }]);
  };

  const updateCreateRule = (index: number, nextRule: TaskRuleForm) => {
    const nextRules = [...createRules];
    nextRules[index] = nextRule;
    setCreateRules(nextRules);
  };

  const removeCreateRule = (index: number) => {
    if (createRules.length === 1) {
      setCreateRules([{ ...EMPTY_RULE }]);
      return;
    }

    setCreateRules((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  };

  const saveCreateRules = async () => {
    const preparedRules = createRules.filter((rule) => rule.description.trim().length > 0);
    if (!preparedRules.length) {
      setStatus("Добавьте хотя бы одну задачу с описанием.");
      return;
    }

    const normalized = preparedRules.map((rule) => ({
      ...rule,
      day_from: createDayFrom,
      day_to: createDayTo,
    }));

    try {
      await saveRules([...rules, ...normalized]);
      setCreateRules([{ ...EMPTY_RULE }]);
      setCreateDayFrom("");
      setCreateDayTo("");
      setIsCreateVisible(false);
      setStatus("Записи добавлены.");
    } catch {
      setStatus("Не удалось добавить записи.");
    }
  };

  const startEditGroup = (group: GroupedRuleBlock) => {
    setEditingGroupKey(group.key);
    setEditingGroupRules(group.items.map((item) => ({ ...item.rule })));
    setEditingGroupIndexes(group.items.map((item) => item.index));
    setEditingGroupDayFrom(group.dayFrom);
    setEditingGroupDayTo(group.dayTo);
  };

  const updateEditingGroupRule = (index: number, nextRule: TaskRuleForm) => {
    const nextRules = [...editingGroupRules];
    nextRules[index] = nextRule;
    setEditingGroupRules(nextRules);
  };

  const addEditingGroupRule = () => {
    setEditingGroupRules((previous) => [...previous, { ...EMPTY_RULE }]);
  };

  const removeEditingGroupRule = (index: number) => {
    if (editingGroupRules.length === 1) {
      setEditingGroupRules([{ ...EMPTY_RULE }]);
      return;
    }

    setEditingGroupRules((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  };

  const saveEditGroup = async () => {
    const prepared = editingGroupRules.filter((rule) => rule.description.trim().length > 0);
    if (!prepared.length) {
      setStatus("Добавьте хотя бы одну задачу с описанием.");
      return;
    }

    const normalized = prepared.map((rule) => ({
      ...rule,
      day_from: editingGroupDayFrom,
      day_to: editingGroupDayTo,
    }));

    const nextRules = rules.filter((_, index) => !editingGroupIndexes.includes(index));
    nextRules.push(...normalized);

    try {
      await saveRules(nextRules);
      setEditingGroupKey(null);
      setEditingGroupRules([]);
      setEditingGroupIndexes([]);
      setStatus("Блок обновлен.");
    } catch {
      setStatus("Не удалось обновить блок.");
    }
  };

  const deleteGroup = async (indexes: number[]) => {
    const nextRules = rules.filter((_, currentIndex) => !indexes.includes(currentIndex));

    try {
      await saveRules(nextRules);
      if (editingGroupKey !== null) {
        setEditingGroupKey(null);
        setEditingGroupRules([]);
        setEditingGroupIndexes([]);
      }
      setStatus("Блок удален.");
    } catch {
      setStatus("Не удалось удалить блок.");
    }
  };

  if (isLoading) {
    return (
      <OverflowScrollBlock
        header_name={"Настройка задач шаблона"}
        button_back_visible={"enable"}
      >
        <p className={styles.info}>Загрузка...</p>
      </OverflowScrollBlock>
    );
  }

  if (isError || !template) {
    return (
      <OverflowScrollBlock
        header_name={"Настройка задач шаблона"}
        button_back_visible={"enable"}
      >
        <DataMessage type="error" />
      </OverflowScrollBlock>
    );
  }

  return (
    <OverflowScrollBlock
      header_name={"Настройка задач шаблона"}
      button_back_visible={"enable"}
    >
      <div className={styles.container}>
        <div className={styles.topBar}>
          {isCreateVisible ? (
            <IconButton
              type="close"
              onClick={() => {
                setIsCreateVisible(false);
                setCreateRules([{ ...EMPTY_RULE }]);
                setCreateDayFrom("");
                setCreateDayTo("");
              }}
            />
          ) : (
            <button
              type="button"
              className={styles.createButton}
              onClick={() => setIsCreateVisible(true)}
            >
              Добавить день
            </button>
          )}
        </div>

        <div className={styles.metaBlock}>
          <p className={styles.meta}>План: {template.name}</p>
          <p className={styles.meta}>График: {template.work_schedule}</p>
          <p className={styles.meta}>Смены: {template.shifts.join(", ")}</p>
        </div>

        {isCreateVisible && (
          <div className={styles.ruleCard}>
            <p className={styles.title}>Новые задачи</p>
            <div className={`${styles.row} ${styles.dayRangeRow}`}>
              <label className={styles.label}>
                День
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  value={createDayFrom}
                  onChange={(event) => setCreateDayFrom(event.target.value)}
                />
              </label>
              <label className={styles.label}>
                До дня (опционально)
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  value={createDayTo}
                  onChange={(event) => setCreateDayTo(event.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className={`${styles.ghostButton} ${styles.addTaskButton}`}
              onClick={addCreateRule}
            >
              + Задача
            </button>
            {createRules.map((rule, index) => (
              <div key={`create-rule-${index}`} className={`${styles.row} ${styles.taskRow}`}>
                <label className={styles.label}>
                  Описание задачи
                  <input
                    className={styles.input}
                    value={rule.description}
                    onChange={(event) =>
                      updateCreateRule(index, { ...rule, description: event.target.value })
                    }
                  />
                </label>
                <label className={styles.label}>
                  Ответственный
                  <select
                    className={styles.input}
                    value={rule.responsible_role}
                    onChange={(event) =>
                      updateCreateRule(index, {
                        ...rule,
                        responsible_role: event.target.value as ResponsibleRole,
                      })
                    }
                  >
                    <option value="Наставник">Наставник</option>
                    <option value="Сотрудник УПиПК">Сотрудник УПиПК</option>
                    <option value="Руководитель отдела">Руководитель отдела</option>
                  </select>
                </label>
                <label className={styles.label}>
                  Ссылки
                  <input
                    className={styles.input}
                    value={rule.links}
                    onChange={(event) =>
                      updateCreateRule(index, { ...rule, links: event.target.value })
                    }
                  />
                </label>
                <div className={styles.inlineActions}>
                  <IconButton type="delete" onClick={() => removeCreateRule(index)} />
                </div>
              </div>
            ))}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.createButton}
                onClick={saveCreateRules}
                disabled={isSaving}
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => {
                  setIsCreateVisible(false);
                  setCreateRules([{ ...EMPTY_RULE }]);
                  setCreateDayFrom("");
                  setCreateDayTo("");
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {status && <p className={styles.status}>{status}</p>}

        {rules.length === 0 && <DataMessage type="noData" />}
        {rules.length > 0 && (
          <div className={styles.list}>
            {groupedRules.map((group) => (
              <div key={`rule-group-${group.key}`} className={styles.ruleCard}>
                <p className={styles.title}>{group.title}</p>
                {editingGroupKey === group.key ? (
                  <>
                    <div className={`${styles.row} ${styles.dayRangeRow}`}>
                      <label className={styles.label}>
                        День
                        <input
                          className={styles.input}
                          type="number"
                          min={1}
                          value={editingGroupDayFrom}
                          onChange={(event) => setEditingGroupDayFrom(event.target.value)}
                        />
                      </label>
                      <label className={styles.label}>
                        До дня (опционально)
                        <input
                          className={styles.input}
                          type="number"
                          min={1}
                          value={editingGroupDayTo}
                          onChange={(event) => setEditingGroupDayTo(event.target.value)}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className={`${styles.ghostButton} ${styles.addTaskButton}`}
                      onClick={addEditingGroupRule}
                    >
                      + Задача
                    </button>
                    {editingGroupRules.map((rule, index) => (
                    <div key={`edit-rule-${index}`} className={`${styles.row} ${styles.taskRow}`}>
                      <label className={styles.label}>
                        Описание задачи
                        <input
                          className={styles.input}
                          value={rule.description}
                          onChange={(event) =>
                            updateEditingGroupRule(index, {
                              ...rule,
                              description: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label className={styles.label}>
                        Ответственный
                        <select
                          className={styles.input}
                          value={rule.responsible_role}
                          onChange={(event) =>
                            updateEditingGroupRule(index, {
                              ...rule,
                              responsible_role: event.target.value as ResponsibleRole,
                            })
                          }
                        >
                          <option value="Наставник">Наставник</option>
                          <option value="Сотрудник УПиПК">Сотрудник УПиПК</option>
                          <option value="Руководитель отдела">Руководитель отдела</option>
                        </select>
                      </label>
                      <label className={styles.label}>
                        Ссылки
                        <input
                          className={styles.input}
                          value={rule.links}
                          onChange={(event) =>
                            updateEditingGroupRule(index, { ...rule, links: event.target.value })
                          }
                        />
                      </label>
                      <div className={styles.inlineActions}>
                        <IconButton type="delete" onClick={() => removeEditingGroupRule(index)} />
                      </div>
                    </div>
                    ))}
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.createButton}
                        onClick={saveEditGroup}
                        disabled={isSaving}
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={() => {
                          setEditingGroupKey(null);
                          setEditingGroupRules([]);
                          setEditingGroupIndexes([]);
                        }}
                      >
                        Отмена
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {group.items.map((item, index) => (
                      <div key={`group-item-${group.key}-${index}`} className={styles.metaBlock}>
                        <p className={styles.meta}>{item.rule.description}</p>
                        <p className={styles.meta}>Ответственный: {item.rule.responsible_role}</p>
                        <p className={styles.meta}>Ссылки: {item.rule.links || "—"}</p>
                      </div>
                    ))}
                    <div className={styles.actions}>
                      <IconButton type="edit" onClick={() => startEditGroup(group)} />
                      <IconButton type="delete" onClick={() => deleteGroup(group.items.map((item) => item.index))} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </OverflowScrollBlock>
  );
}

export default TemplateTasks;
