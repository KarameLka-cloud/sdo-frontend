import { FormEvent, JSX, useState } from "react";
import { toast } from "sonner";
import { useCreateAdaptationPlanTemplateMutation } from "@/services/store/features/user.ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import {
  TEMPLATE_ROUTES,
  WORK_SCHEDULE_OPTIONS,
} from "@/pages/Admin/shared/adminResourceConfig.ts";

function TemplateCreate(): JSX.Element {
  const [createTemplate, { isLoading: isCreating }] =
    useCreateAdaptationPlanTemplateMutation();

  const [name, setName] = useState("");
  const [workSchedule, setWorkSchedule] = useState("");
  const [shift, setShift] = useState("");

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
    } catch {
      toast.error("Не удалось создать шаблон");
    }
  };

  return (
    <AdminFormPage
      backTo={TEMPLATE_ROUTES.list}
      backLabel="К списку планов адаптации"
    >
      <Card>
        <CardHeader>
          <CardTitle>Создание плана адаптации</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
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
                  <SelectContent>
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
            </FieldGroup>
          </CardContent>
          <Separator />
          <CardFooter>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Spinner />}
              Создать план
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AdminFormPage>
  );
}

export default TemplateCreate;
