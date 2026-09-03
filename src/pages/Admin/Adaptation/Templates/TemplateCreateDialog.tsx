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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { WORK_SCHEDULE_OPTIONS } from "@/components/resource-list/resourceRoutes.ts";

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

    if (!name.trim()) return toast.error("Укажите название шаблона");
    if (!workSchedule) return toast.error("Выберите график работы");

    const shiftNumber = Number(shift);
    if (!Number.isInteger(shiftNumber) || shiftNumber < 1) {
      return toast.error("Укажите корректный номер смены");
    }

    try {
      await createTemplate({
        name: name.trim(),
        work_schedule: workSchedule,
        shifts: [shiftNumber],
      }).unwrap();
      toast.success("Шаблон создан");
      onOpenChange(false);
    } catch {
      toast.error("Не удалось создать шаблон");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Создание плана адаптации</DialogTitle>
          <DialogDescription className="sr-only">
            Укажите название, график работы и смену нового плана адаптации
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
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
              Создать план
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateCreateDialog;
