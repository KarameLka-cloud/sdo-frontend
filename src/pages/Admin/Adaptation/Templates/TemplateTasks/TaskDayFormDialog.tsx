import { JSX } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { FieldGroup } from "@/components/ui/shadcn/field";
import { Spinner } from "@/components/ui/shadcn/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import DayRangeFields from "./DayRangeFields";
import { RuleRowFields } from "./RuleRowFields";
import { TaskRuleForm } from "./taskRuleForm";

function TaskDayFormDialog({
  open,
  onOpenChange,
  isEdit,
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
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
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
  onDelete?: () => void;
}): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="px-4 py-4">
          <DialogTitle>
            {isEdit ? "Редактирование дня" : "Новый день"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit
              ? "Измените день и задачи шаблона"
              : "Укажите день и добавьте задачи шаблона"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <FieldGroup className="grid gap-4">
              <DayRangeFields
                idPrefix={isEdit ? "edit-day" : "create-day"}
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
                  key={`${isEdit ? "edit" : "create"}-rule-${index}`}
                  idPrefix={`${isEdit ? "edit" : "create"}-rule-${index}`}
                  rule={rule}
                  onChange={(nextRule) => onUpdateRule(index, nextRule)}
                  onRemove={() => onRemoveRule(index)}
                />
              ))}
            </FieldGroup>
          </div>
          <DialogFooter className={isEdit ? "justify-between" : undefined}>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Spinner />}
              Сохранить
            </Button>
            {isEdit && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isSaving}
              >
                Удалить
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskDayFormDialog;
