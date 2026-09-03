import {
  AdaptationPlanTemplateTask,
} from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import { compareDayRanges } from "@/utils/formatDayRange.ts";

export type ResponsibleRole =
  | "Руководитель отдела"
  | "Наставник"
  | "Сотрудник УПиПК";

export type ResponsibleRoleForm = ResponsibleRole | "";

export type TaskRule = AdaptationPlanTemplateTask & {
  responsible_role: ResponsibleRole;
  links: string[];
};

export interface TaskRuleForm {
  description: string;
  responsible_role: ResponsibleRoleForm;
  day_from?: string;
  day_to?: string;
  links: string;
}

export interface GroupedRuleBlock {
  key: string;
  title: string;
  dayFrom: string;
  dayTo: string;
  items: Array<{ rule: TaskRuleForm; index: number }>;
}

export const EMPTY_RULE: TaskRuleForm = {
  description: "",
  responsible_role: "",
  links: "",
};

export const RESPONSIBLE_ROLE_OPTIONS: ResponsibleRole[] = [
  "Наставник",
  "Сотрудник УПиПК",
  "Руководитель отдела",
];

export function toFormRule(rule: AdaptationPlanTemplateTask): TaskRuleForm {
  return {
    description: rule.description,
    responsible_role: rule.responsible_role as ResponsibleRoleForm,
    day_from: rule.day_from ? String(rule.day_from) : "",
    day_to: rule.day_to ? String(rule.day_to) : "",
    links: (rule.links ?? []).join(", "),
  };
}

export function toPayloadRule(rule: TaskRuleForm): TaskRule {
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

export function groupTaskRules(rules: TaskRuleForm[]): GroupedRuleBlock[] {
  const map = new Map<string, GroupedRuleBlock>();

  rules.forEach((rule, index) => {
    const dayFrom = rule.day_from || "";
    const dayTo = rule.day_to || "";
    const key = `${dayFrom}:${dayTo}`;

    if (!map.has(key)) {
      const title = dayFrom
        ? dayTo
          ? `День ${dayFrom}-${dayTo}`
          : `День ${dayFrom}`
        : "Все дни";
      map.set(key, { key, title, dayFrom, dayTo, items: [] });
    }

    map.get(key)?.items.push({ rule, index });
  });

  return Array.from(map.values()).sort((left, right) =>
    compareDayRanges(
      left.dayFrom ? Number(left.dayFrom) : null,
      left.dayTo ? Number(left.dayTo) : null,
      right.dayFrom ? Number(right.dayFrom) : null,
      right.dayTo ? Number(right.dayTo) : null,
    ),
  );
}
