import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateAdaptationPlanTemplateMutation } from "@/services/store/features/adaptation.ts";
import { Button } from "@/components/ui/shadcn/button";
import { Field, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { DialogFooter } from "@/components/ui/shadcn/dialog";
import FormDialog from "@/components/ui/custom/FormDialog";
import { WORK_SCHEDULE_OPTIONS } from "@/constants/adaptation.ts";
import { validateTemplateMeta } from "@/pages/Admin/Adaptation/Templates/templateMetaForm.ts";
import { toastMutationError } from "@/utils/apiError.ts";

function TemplateCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [createTemplate, { isLoading: isCreating }] =
    useCreateAdaptationPlanTemplateMutation();

  const [name, setName] = useState("");
  const [workSchedule, setWorkSchedule] = useState("");
  const [shift, setShift] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setWorkSchedule("");
      setShift("");
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const meta = validateTemplateMeta(name, workSchedule, shift);
    if (!meta.ok) {
      return toast.error(meta.error);
    }

    try {
      await createTemplate({
        name: meta.name,
        work_schedule: meta.workSchedule,
        shifts: [meta.shift],
      }).unwrap();
      toast.success("Шаблон создан");
      onOpenChange(false);
    } catch (error) {
      toastMutationError(error, "Не удалось создать шаблон");
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Создание шаблона адаптации"
      description="Укажите название, график работы и смену нового шаблона адаптации"
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="template-name">Название</FieldLabel>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="template-schedule">График работы</FieldLabel>
              <Select value={workSchedule} onValueChange={setWorkSchedule}>
                <SelectTrigger id="template-schedule" className="w-full">
                  <SelectValue placeholder="Выберите график" />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {WORK_SCHEDULE_OPTIONS.map((schedule) => (
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
                onChange={(e) => setShift(e.target.value)}
              />
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isCreating}>
            {isCreating && <Spinner />}
            Создать шаблон
          </Button>
        </DialogFooter>
      </form>
    </FormDialog>
  );
}

export default TemplateCreateDialog;
