import { useState } from "react";
import { EMPTY_RULE, GroupedRuleBlock, TaskRuleForm } from "./taskRuleForm";

export type TaskRuleDraft = {
  mode: "create" | "edit";
  rules: TaskRuleForm[];
  dayFrom: string;
  dayTo: string;
  groupKey: string | null;
  indexes: number[];
};

const emptyCreateDraft = (): TaskRuleDraft => ({
  mode: "create",
  rules: [{ ...EMPTY_RULE }],
  dayFrom: "",
  dayTo: "",
  groupKey: null,
  indexes: [],
});

/** Create and edit share one dialog, so they share one draft too. */
export function useTaskRuleDraft() {
  const [draft, setDraft] = useState<TaskRuleDraft | null>(null);

  const close = () => setDraft(null);

  const startCreate = () => setDraft(emptyCreateDraft());

  const startEdit = (group: GroupedRuleBlock) =>
    setDraft({
      mode: "edit",
      rules: group.items.map((item) => ({ ...item.rule })),
      dayFrom: group.dayFrom,
      dayTo: group.dayTo,
      groupKey: group.key,
      indexes: group.items.map((item) => item.index),
    });

  const addRule = () =>
    setDraft((previous) =>
      previous
        ? { ...previous, rules: [...previous.rules, { ...EMPTY_RULE }] }
        : previous,
    );

  const updateRule = (index: number, nextRule: TaskRuleForm) =>
    setDraft((previous) => {
      if (!previous) {
        return previous;
      }
      const rules = [...previous.rules];
      rules[index] = nextRule;
      return { ...previous, rules };
    });

  const removeRule = (index: number) =>
    setDraft((previous) => {
      if (!previous) {
        return previous;
      }
      return {
        ...previous,
        rules:
          previous.rules.length === 1
            ? [{ ...EMPTY_RULE }]
            : previous.rules.filter((_, currentIndex) => currentIndex !== index),
      };
    });

  const setDayFrom = (dayFrom: string) =>
    setDraft((previous) => (previous ? { ...previous, dayFrom } : previous));

  const setDayTo = (dayTo: string) =>
    setDraft((previous) => (previous ? { ...previous, dayTo } : previous));

  return {
    draft,
    isOpen: draft !== null,
    isEdit: draft?.mode === "edit",
    close,
    startCreate,
    startEdit,
    addRule,
    updateRule,
    removeRule,
    setDayFrom,
    setDayTo,
  };
}
