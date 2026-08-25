import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateAdaptationPlanTemplateMutation } from "@/services/store/features/user.ts";
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
import { WORK_SCHEDULE_OPTIONS } from "@/pages/Admin/shared/adminResourceConfig.ts";

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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создание плана адаптации</DialogTitle>
          <DialogDescription className="sr-only">
            Укажите название, график работы и смену нового плана адаптации
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
