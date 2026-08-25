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
import { RuleRowFields } from "./RuleRowFields";
import { TaskRuleForm } from "./taskRuleForm";

interface CreateTaskRulesCardProps {
  dayFrom: string;
  dayTo: string;
  rules: TaskRuleForm[];
  isSaving: boolean;
  onDayFromChange: (value: string) => void;
  onDayToChange: (value: string) => void;
  onAddRule: () => void;
  onUpdateRule: (index: number, nextRule: TaskRuleForm) => void;
  onRemoveRule: (index: number) => void;
  onSave: () => void;
}

function CreateTaskRulesCard({
  dayFrom,
  dayTo,
  rules,
  isSaving,
  onDayFromChange,
  onDayToChange,
  onAddRule,
  onUpdateRule,
  onRemoveRule,
  onSave,
}: CreateTaskRulesCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Новые задачи</CardTitle>
      </CardHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <CardContent className="p-4">
          <FieldGroup className="grid gap-4">
            <DayRangeFields
              idPrefix="create"
              dayFrom={dayFrom}
              dayTo={dayTo}
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
            {rules.map((rule, index) => (
              <RuleRowFields
                key={`create-rule-${index}`}
                idPrefix={`create-rule-${index}`}
                rule={rule}
                onChange={(nextRule) => onUpdateRule(index, nextRule)}
                onRemove={() => onRemoveRule(index)}
              />
            ))}
          </FieldGroup>
        </CardContent>
        <Separator />
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Spinner />}
            Сохранить
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default CreateTaskRulesCard;
