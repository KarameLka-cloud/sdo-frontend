import { JSX } from "react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { FieldGroup } from "@/components/ui/shadcn/field";
import { RuleRowReadonly } from "./RuleRowFields";
import { GroupedRuleBlock } from "./taskRuleForm";

function TaskRuleGroup({
  group,
  onStartEdit,
}: {
  group: GroupedRuleBlock;
  onStartEdit: () => void;
}): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{group.title}</CardTitle>
      </CardHeader>
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
      <CardFooter>
        <Button type="button" variant="outline" onClick={onStartEdit}>
          Редактировать
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TaskRuleGroup;
