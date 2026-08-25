import { FormEvent, JSX } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Separator } from "@/components/ui/shadcn/separator";
import { Spinner } from "@/components/ui/shadcn/spinner";

interface TemplateMetadataCardProps {
  name: string;
  workSchedule: string;
  shift: string;
  workScheduleOptions: string[];
  isSaving: boolean;
  isDeleting: boolean;
  isCreateVisible: boolean;
  onNameChange: (value: string) => void;
  onWorkScheduleChange: (value: string) => void;
  onShiftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onShowCreate: () => void;
  onCancelCreate: () => void;
  onDelete: () => void;
}

function TemplateMetadataCard({
  name,
  workSchedule,
  shift,
  workScheduleOptions,
  isSaving,
  isDeleting,
  isCreateVisible,
  onNameChange,
  onWorkScheduleChange,
  onShiftChange,
  onSubmit,
  onShowCreate,
  onCancelCreate,
  onDelete,
}: TemplateMetadataCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Редактирование плана адаптации</CardTitle>
        <CardDescription>Шаблон плана адаптации</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <form id="template-metadata-form" onSubmit={onSubmit}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="template-name">Название</FieldLabel>
              <Input
                id="template-name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="template-schedule">График работы</FieldLabel>
              <Select value={workSchedule} onValueChange={onWorkScheduleChange}>
                <SelectTrigger id="template-schedule" className="w-full">
                  <SelectValue placeholder="Выберите график" />
                </SelectTrigger>
                <SelectContent>
                  {workScheduleOptions.map((schedule) => (
                    <SelectItem key={schedule} value={schedule}>
                      {schedule}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="template-shift">Смена</FieldLabel>
              <Input
                id="template-shift"
                type="number"
                min={1}
                step={1}
                value={shift}
                onChange={(event) => onShiftChange(event.target.value)}
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between">
        <div className="flex gap-2">
          <Button
            type="submit"
            form="template-metadata-form"
            disabled={isSaving}
          >
            {isSaving && <Spinner />}
            Сохранить
          </Button>
          {isCreateVisible ? (
            <Button type="button" variant="outline" onClick={onCancelCreate}>
              <X className="size-4" />
              Отмена
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onShowCreate}>
              <Plus className="size-4" />
              Добавить задачи
            </Button>
          )}
        </div>
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting || isSaving}
          onClick={onDelete}
        >
          {isDeleting && <Spinner />}
          Удалить план
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TemplateMetadataCard;
