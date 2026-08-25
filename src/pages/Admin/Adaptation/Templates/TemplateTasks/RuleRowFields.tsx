import { JSX } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import ReadonlyFieldValue from "@/components/ui/custom/ReadonlyFieldValue";
import {
  RESPONSIBLE_ROLE_OPTIONS,
  ResponsibleRole,
  TaskRuleForm,
} from "./taskRuleForm";

interface RuleRowFieldsProps {
  rule: TaskRuleForm;
  idPrefix: string;
  onChange: (nextRule: TaskRuleForm) => void;
  onRemove: () => void;
}

export function RuleRowFields({
  rule,
  idPrefix,
  onChange,
  onRemove,
}: RuleRowFieldsProps): JSX.Element {
  return (
    <div className="rounded-lg border p-4">
      <FieldGroup className="grid gap-4">
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-role`}>Ответственный</FieldLabel>
            <Select
              value={rule.responsible_role || undefined}
              onValueChange={(value) =>
                onChange({
                  ...rule,
                  responsible_role: value as ResponsibleRole,
                })
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
              onChange={(event) =>
                onChange({ ...rule, links: event.target.value })
              }
              placeholder="Через запятую"
            />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onRemove}>
            <Trash2 className="size-4" />
            Удалить задачу
          </Button>
        </div>
      </FieldGroup>
    </div>
  );
}

export function RuleRowReadonly({
  rule,
}: {
  rule: TaskRuleForm;
}): JSX.Element {
  return (
    <div className="rounded-lg border p-4">
      <FieldGroup className="grid gap-4">
        <Field>
          <FieldLabel>Описание задачи</FieldLabel>
          <ReadonlyFieldValue value={rule.description} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Ответственный</FieldLabel>
            <ReadonlyFieldValue value={rule.responsible_role} />
          </Field>
          <Field>
            <FieldLabel>Ссылки</FieldLabel>
            <ReadonlyFieldValue value={rule.links} />
          </Field>
        </div>
      </FieldGroup>
    </div>
  );
}
