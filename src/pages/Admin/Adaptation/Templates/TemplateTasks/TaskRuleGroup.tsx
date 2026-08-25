import { JSX } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { FieldGroup } from "@/components/ui/shadcn/field";
import { Separator } from "@/components/ui/shadcn/separator";
import { Spinner } from "@/components/ui/shadcn/spinner";
import DayRangeFields from "./DayRangeFields";
import { RuleRowFields, RuleRowReadonly } from "./RuleRowFields";
import { GroupedRuleBlock, TaskRuleForm } from "./taskRuleForm";

interface TaskRuleGroupProps {
  group: GroupedRuleBlock;
  isEditing: boolean;
  isSaving: boolean;
  editingRules: TaskRuleForm[];
  editingDayFrom: string;
  editingDayTo: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDeleteGroup: () => void;
  onDayFromChange: (value: string) => void;
  onDayToChange: (value: string) => void;
  onAddRule: () => void;
  onUpdateRule: (index: number, nextRule: TaskRuleForm) => void;
  onRemoveRule: (index: number) => void;
}

function TaskRuleGroup({
  group,
  isEditing,
  isSaving,
  editingRules,
  editingDayFrom,
  editingDayTo,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteGroup,
  onDayFromChange,
  onDayToChange,
  onAddRule,
  onUpdateRule,
  onRemoveRule,
}: TaskRuleGroupProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{group.title}</CardTitle>
      </CardHeader>
      {isEditing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSaveEdit();
          }}
        >
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4">
              <DayRangeFields
                idPrefix={`edit-${group.key}`}
                dayFrom={editingDayFrom}
                dayTo={editingDayTo}
                onDayFromChange={onDayFromChange}
                onDayToChange={onDayToChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={onAddRule}
              >
                <Plus className="size-4" />
                Задача
              </Button>
              {editingRules.map((rule, index) => (
                <RuleRowFields
                  key={`edit-rule-${group.key}-${index}`}
                  idPrefix={`edit-rule-${group.key}-${index}`}
                  rule={rule}
                  onChange={(nextRule) => onUpdateRule(index, nextRule)}
                  onRemove={() => onRemoveRule(index)}
                />
              ))}
            </FieldGroup>
          </CardContent>
          <Separator />
          <CardFooter className="justify-between">
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Spinner />}
                Сохранить
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEdit}
                disabled={isSaving}
              >
                Отмена
              </Button>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteGroup}
              disabled={isSaving}
            >
              Удалить группу
            </Button>
          </CardFooter>
        </form>
      ) : (
        <>
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4">
              {group.items.map((item, index) => (
                <RuleRowReadonly
                  key={`group-item-${group.key}-${index}`}
                  rule={item.rule}
                />
              ))}
            </FieldGroup>
          </CardContent>
          <Separator />
          <CardFooter>
            <Button type="button" variant="outline" onClick={onStartEdit}>
              Редактировать
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default TaskRuleGroup;
