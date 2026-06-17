import { JSX, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import {
  useDeleteAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplatesQuery,
  useUpdateAdaptationPlanTemplateMutation,
} from "@/services/store/features/user.ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import {
  TEMPLATE_ROUTES,
  parseEntityId,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminEditDelete } from "@/pages/Admin/shared/useAdminEditDelete.ts";

type ResponsibleRole = "Руководитель отдела" | "Наставник" | "Сотрудник УПиПК";

type ResponsibleRoleForm = ResponsibleRole | "";

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
  responsible_role: ResponsibleRoleForm;
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
  responsible_role: "",
  links: "",
};

const RESPONSIBLE_ROLE_OPTIONS: ResponsibleRole[] = [
  "Наставник",
  "Сотрудник УПиПК",
  "Руководитель отдела",
];

const DELETE_MESSAGES = {
  confirm: "Удалить шаблон адаптации?",
  success: "Шаблон адаптации удалён",
  error: "Не удалось удалить шаблон",
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
  const responsible_role = rule.responsible_role;
  if (!responsible_role) {
    throw new Error("Responsible role required");
  }

  return {
    description: rule.description.trim(),
    responsible_role,
    day_from: rule.day_from ? Number(rule.day_from) : null,
    day_to: rule.day_to ? Number(rule.day_to) : null,
    links: rule.links
      .split(",")
      .map((link) => link.trim())
      .filter(Boolean),
  };
}

interface DayRangeFieldsProps {
  dayFrom: string;
  dayTo: string;
  onDayFromChange: (value: string) => void;
  onDayToChange: (value: string) => void;
  idPrefix: string;
}

function DayRangeFields({
  dayFrom,
  dayTo,
  onDayFromChange,
  onDayToChange,
  idPrefix,
}: DayRangeFieldsProps): JSX.Element {
  return (
    <FieldGroup className="grid gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-day-from`}>День</FieldLabel>
        <Input
          id={`${idPrefix}-day-from`}
          type="number"
          min={1}
          value={dayFrom}
          onChange={(event) => onDayFromChange(event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-day-to`}>
          До дня (опционально)
        </FieldLabel>
        <Input
          id={`${idPrefix}-day-to`}
          type="number"
          min={1}
          value={dayTo}
          onChange={(event) => onDayToChange(event.target.value)}
        />
      </Field>
    </FieldGroup>
  );
}

interface RuleRowFieldsProps {
  rule: TaskRuleForm;
  idPrefix: string;
  onChange: (nextRule: TaskRuleForm) => void;
  onRemove: () => void;
}

function RuleRowFields({
  rule,
  idPrefix,
  onChange,
  onRemove,
}: RuleRowFieldsProps): JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.65fr)_minmax(10rem,0.75fr)_auto] sm:items-end">
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-description`}>
          Описание задачи
        </FieldLabel>
        <Input
          id={`${idPrefix}-description`}
          value={rule.description}
          onChange={(event) =>
            onChange({ ...rule, description: event.target.value })
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-role`}>Ответственный</FieldLabel>
        <Select
          value={rule.responsible_role || undefined}
          onValueChange={(value) =>
            onChange({ ...rule, responsible_role: value as ResponsibleRole })
          }
        >
          <SelectTrigger id={`${idPrefix}-role`} className="w-full">
            <SelectValue placeholder="Выберите ответственного" />
          </SelectTrigger>
          <SelectContent>
            {RESPONSIBLE_ROLE_OPTIONS.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-links`}>Ссылки</FieldLabel>
        <Input
          id={`${idPrefix}-links`}
          value={rule.links}
          onChange={(event) => onChange({ ...rule, links: event.target.value })}
        />
      </Field>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={onRemove}
        aria-label="Удалить задачу"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function TemplateTasks(): JSX.Element {
  const navigate = useNavigate();
  const { templateId: templateIdParam } = useParams();
  const templateId = parseEntityId(templateIdParam) ?? 0;

  const {
    data = [],
    isLoading,
    isError,
  } = useGetAdaptationPlanTemplatesQuery(undefined);
  const [updateTemplate, { isLoading: isSaving }] =
    useUpdateAdaptationPlanTemplateMutation();
  const deleteMutation = useDeleteAdaptationPlanTemplateMutation();
  const { handleDelete, isDeleting } = useAdminEditDelete(
    deleteMutation,
    DELETE_MESSAGES,
    () => navigate(TEMPLATE_ROUTES.list),
  );

  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [createRules, setCreateRules] = useState<TaskRuleForm[]>([
    { ...EMPTY_RULE },
  ]);
  const [createDayFrom, setCreateDayFrom] = useState("");
  const [createDayTo, setCreateDayTo] = useState("");
  const [editingGroupKey, setEditingGroupKey] = useState<string | null>(null);
  const [editingGroupRules, setEditingGroupRules] = useState<TaskRuleForm[]>(
    [],
  );
  const [editingGroupIndexes, setEditingGroupIndexes] = useState<number[]>([]);
  const [editingGroupDayFrom, setEditingGroupDayFrom] = useState("");
  const [editingGroupDayTo, setEditingGroupDayTo] = useState("");

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

  const resetCreateForm = () => {
    setIsCreateVisible(false);
    setCreateRules([{ ...EMPTY_RULE }]);
    setCreateDayFrom("");
    setCreateDayTo("");
  };

  const resetEditGroup = () => {
    setEditingGroupKey(null);
    setEditingGroupRules([]);
    setEditingGroupIndexes([]);
    setEditingGroupDayFrom("");
    setEditingGroupDayTo("");
  };

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

    setCreateRules((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const saveCreateRules = async () => {
    const preparedRules = createRules.filter(
      (rule) => rule.description.trim().length > 0,
    );
    if (!preparedRules.length) {
      toast.error("Добавьте хотя бы одну задачу с описанием.");
      return;
    }

    if (preparedRules.some((rule) => !rule.responsible_role)) {
      toast.error("Выберите ответственного для каждой задачи.");
      return;
    }

    const normalized = preparedRules.map((rule) => ({
      ...rule,
      day_from: createDayFrom,
      day_to: createDayTo,
    }));

    try {
      await saveRules([...rules, ...normalized]);
      resetCreateForm();
      toast.success("Задачи добавлены");
    } catch {
      toast.error("Не удалось сохранить задачи");
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

    setEditingGroupRules((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const saveEditGroup = async () => {
    const prepared = editingGroupRules.filter(
      (rule) => rule.description.trim().length > 0,
    );
    if (!prepared.length) {
      toast.error("Добавьте хотя бы одну задачу с описанием.");
      return;
    }

    if (prepared.some((rule) => !rule.responsible_role)) {
      toast.error("Выберите ответственного для каждой задачи.");
      return;
    }

    const normalized = prepared.map((rule) => ({
      ...rule,
      day_from: editingGroupDayFrom,
      day_to: editingGroupDayTo,
    }));

    const nextRules = rules.filter(
      (_, index) => !editingGroupIndexes.includes(index),
    );
    nextRules.push(...normalized);

    try {
      await saveRules(nextRules);
      resetEditGroup();
      toast.success("Изменения сохранены");
    } catch {
      toast.error("Не удалось сохранить изменения");
    }
  };

  const deleteGroup = async (indexes: number[]) => {
    const nextRules = rules.filter(
      (_, currentIndex) => !indexes.includes(currentIndex),
    );

    try {
      await saveRules(nextRules);
      if (editingGroupKey !== null) {
        resetEditGroup();
      }
      toast.success("Группа задач удалена");
    } catch {
      toast.error("Не удалось удалить группу задач");
    }
  };

  if (!templateId) {
    return (
      <AdminFormPage
        backTo={TEMPLATE_ROUTES.list}
        backLabel="К списку планов адаптации"
        isError
      >
        <></>
      </AdminFormPage>
    );
  }

  if (isLoading) {
    return (
      <AdminFormPage
        backTo={TEMPLATE_ROUTES.list}
        backLabel="К списку планов адаптации"
        isLoading
      >
        <></>
      </AdminFormPage>
    );
  }

  if (isError || !template) {
    return (
      <AdminFormPage
        backTo={TEMPLATE_ROUTES.list}
        backLabel="К списку планов адаптации"
        isNoData={!isError}
        isError={isError}
      >
        <></>
      </AdminFormPage>
    );
  }

  return (
    <AdminFormPage
      backTo={TEMPLATE_ROUTES.list}
      backLabel="К списку планов адаптации"
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{template.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              График: {template.work_schedule} | Смены:{" "}
              {template.shifts.join(", ")}
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting || isSaving}
            onClick={() => handleDelete(template.id)}
          >
            {isDeleting && <Spinner />}
            Удалить план
          </Button>
        </CardHeader>
        <Separator />
        <CardFooter className="justify-start">
          {isCreateVisible ? (
            <Button type="button" variant="outline" onClick={resetCreateForm}>
              <X className="size-4" />
              Отмена
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateVisible(true)}
            >
              <Plus className="size-4" />
              Добавить задачи
            </Button>
          )}
        </CardFooter>
      </Card>

      {isCreateVisible && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Новые задачи</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4 pt-0">
            <DayRangeFields
              idPrefix="create"
              dayFrom={createDayFrom}
              dayTo={createDayTo}
              onDayFromChange={setCreateDayFrom}
              onDayToChange={setCreateDayTo}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={addCreateRule}
            >
              <Plus className="size-4" />
              Задача
            </Button>
            {createRules.map((rule, index) => (
              <RuleRowFields
                key={`create-rule-${index}`}
                idPrefix={`create-rule-${index}`}
                rule={rule}
                onChange={(nextRule) => updateCreateRule(index, nextRule)}
                onRemove={() => removeCreateRule(index)}
              />
            ))}
          </CardContent>
          <Separator />
          <CardFooter className="gap-2">
            <Button
              type="button"
              onClick={saveCreateRules}
              disabled={isSaving}
            >
              {isSaving && <Spinner />}
              Сохранить
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetCreateForm}
              disabled={isSaving}
            >
              Отмена
            </Button>
          </CardFooter>
        </Card>
      )}

      {rules.length === 0 && !isCreateVisible && (
        <p className="text-sm text-muted-foreground">
          Задачи ещё не добавлены. Нажмите «Добавить задачи», чтобы создать
          первую группу.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {groupedRules.map((group) => (
          <Card key={`rule-group-${group.key}`}>
            <CardHeader>
              <CardTitle className="text-base">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4 pt-0">
              {editingGroupKey === group.key ? (
                <>
                  <DayRangeFields
                    idPrefix={`edit-${group.key}`}
                    dayFrom={editingGroupDayFrom}
                    dayTo={editingGroupDayTo}
                    onDayFromChange={setEditingGroupDayFrom}
                    onDayToChange={setEditingGroupDayTo}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={addEditingGroupRule}
                  >
                    <Plus className="size-4" />
                    Задача
                  </Button>
                  {editingGroupRules.map((rule, index) => (
                    <RuleRowFields
                      key={`edit-rule-${group.key}-${index}`}
                      idPrefix={`edit-rule-${group.key}-${index}`}
                      rule={rule}
                      onChange={(nextRule) =>
                        updateEditingGroupRule(index, nextRule)
                      }
                      onRemove={() => removeEditingGroupRule(index)}
                    />
                  ))}
                </>
              ) : (
                group.items.map((item, index) => (
                  <div
                    key={`group-item-${group.key}-${index}`}
                    className="rounded-lg border p-3 text-sm"
                  >
                    <p className="font-medium">{item.rule.description}</p>
                    <p className="text-muted-foreground">
                      Ответственный: {item.rule.responsible_role}
                    </p>
                    <p className="text-muted-foreground">
                      Ссылки: {item.rule.links || "—"}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
            <Separator />
            <CardFooter className="gap-2">
              {editingGroupKey === group.key ? (
                <>
                  <Button
                    type="button"
                    onClick={saveEditGroup}
                    disabled={isSaving}
                  >
                    {isSaving && <Spinner />}
                    Сохранить
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteGroup(editingGroupIndexes)}
                    disabled={isSaving}
                  >
                    Удалить группу
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetEditGroup}
                    disabled={isSaving}
                  >
                    Отмена
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => startEditGroup(group)}
                >
                  Редактировать
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </AdminFormPage>
  );
}

export default TemplateTasks;
