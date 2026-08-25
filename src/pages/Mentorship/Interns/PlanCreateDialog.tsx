import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateAdaptationPlanMutation,
  useGetAdaptationPlanTemplatesQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
} from "@/services/store/features/user.ts";
import { UserType } from "@/interfaces/api/UserType.ts";
import { USER_ROLES } from "@/constants/roles.ts";
import { Button } from "@/components/ui/shadcn/button";
import { Field, FieldLabel } from "@/components/ui/shadcn/field";
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
import Loader from "@/components/ui/custom/Loader";
import SearchableCombobox from "@/components/ui/custom/SearchableCombobox";
import DatePickerField from "@/components/ui/custom/DatePickerField";
import { AdaptationPlanTemplateType } from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import { resolveRoleUsers } from "@/utils/resolveRoleUsers.ts";
import { firstShift, formatShifts } from "@/utils/formatShifts.ts";

const sortTemplates = (
  a: AdaptationPlanTemplateType,
  b: AdaptationPlanTemplateType,
) => {
  const shiftA = Math.min(...a.shifts);
  const shiftB = Math.min(...b.shifts);
  return shiftA !== shiftB
    ? shiftA - shiftB
    : a.name.localeCompare(b.name, "ru");
};

const toUserOptions = (list: UserType[]) =>
  list
    .filter((user) => user.id != null)
    .map((user) => ({
      value: String(user.id),
      label: user.name ?? "",
    }));

function PlanCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [createAdaptationPlan, { isLoading: isCreating }] =
    useCreateAdaptationPlanMutation();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery(
    undefined,
    { skip: !open },
  );
  const { data: templatesData, isLoading: isTemplatesLoading } =
    useGetAdaptationPlanTemplatesQuery(undefined, { skip: !open });
  const { data: mentorsData } = useGetMentorsQuery(undefined, { skip: !open });
  const { data: departmentHeadsData } = useGetDepartmentHeadsQuery(undefined, {
    skip: !open,
  });

  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [workSchedule, setWorkSchedule] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [departmentHeadId, setDepartmentHeadId] = useState("");

  const users = (usersData ?? []) as UserType[];
  const templates = (templatesData ?? []) as AdaptationPlanTemplateType[];
  const mentors = resolveRoleUsers(mentorsData, users, USER_ROLES.MENTOR);
  const departmentHeads = resolveRoleUsers(
    departmentHeadsData,
    users,
    USER_ROLES.DEPARTMENT_HEAD,
  );
  const workSchedules = [
    ...new Set(templates.map((template) => template.work_schedule)),
  ];
  const filteredTemplates = workSchedule
    ? templates
        .filter((template) => template.work_schedule === workSchedule)
        .sort(sortTemplates)
    : [];
  const isLoading = isUsersLoading || isTemplatesLoading;

  useEffect(() => {
    if (!open) {
      setUserId("");
      setStartDate("");
      setWorkSchedule("");
      setTemplateId("");
      setMentorId("");
      setDepartmentHeadId("");
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) return toast.error("Выберите пользователя");
    if (!startDate) return toast.error("Укажите дату начала стажировки");
    if (!workSchedule) return toast.error("Выберите режим работы");
    if (!templateId) return toast.error("Выберите шаблон адаптации");

    const template = templates.find((item) => item.id === Number(templateId));
    if (!template) return toast.error("Выбранный шаблон не найден");
    if (template.work_schedule !== workSchedule) {
      return toast.error("Выберите шаблон с подходящим режимом работы");
    }

    const selectedShift = firstShift(template.shifts);
    if (selectedShift == null) {
      return toast.error("У выбранного шаблона не найдены смены");
    }
    if (!mentorId) return toast.error("Выберите наставника");
    if (!departmentHeadId) {
      return toast.error("Выберите руководителя отдела");
    }

    try {
      await createAdaptationPlan({
        user_id: Number(userId),
        start_date: startDate,
        adaptation_plan_template_id: Number(templateId),
        shift: selectedShift,
        mentor: Number(mentorId),
        department_head: Number(departmentHeadId),
      }).unwrap();
      toast.success("План адаптации создан");
      onOpenChange(false);
    } catch {
      toast.error("Не удалось создать план адаптации");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создание плана адаптации</DialogTitle>
          <DialogDescription className="sr-only">
            Заполните данные стажера, шаблон и ответственных для нового плана
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="plan-user">Стажер</FieldLabel>
                <SearchableCombobox
                  id="plan-user"
                  value={userId}
                  onValueChange={setUserId}
                  options={toUserOptions(users)}
                  placeholder="Выберите пользователя"
                  searchPlaceholder="Поиск стажера..."
                  emptyMessage="Стажер не найден"
                />
              </Field>
              <DatePickerField
                dateId="plan-start-date"
                dateLabel="Дата начала стажировки"
                date={startDate}
                onDateChange={setStartDate}
              />
              <Field>
                <FieldLabel htmlFor="plan-schedule">Режим работы</FieldLabel>
                <Select
                  value={workSchedule}
                  onValueChange={(value) => {
                    setWorkSchedule(value);
                    setTemplateId("");
                  }}
                >
                  <SelectTrigger id="plan-schedule" className="w-full">
                    <SelectValue placeholder="Выберите режим работы" />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    {workSchedules.map((schedule) => (
                      <SelectItem key={schedule} value={schedule}>
                        {schedule}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-template">
                  Шаблон адаптации
                </FieldLabel>
                <Select
                  value={templateId}
                  onValueChange={setTemplateId}
                  disabled={!workSchedule}
                >
                  <SelectTrigger id="plan-template" className="w-full">
                    <SelectValue placeholder="Выберите шаблон" />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    {filteredTemplates.map((template) => (
                      <SelectItem key={template.id} value={String(template.id)}>
                        {template.name} (смена:{" "}
                        {formatShifts(template.shifts)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-mentor">Наставник</FieldLabel>
                <SearchableCombobox
                  id="plan-mentor"
                  value={mentorId}
                  onValueChange={setMentorId}
                  options={toUserOptions(mentors)}
                  placeholder="Выберите наставника"
                  searchPlaceholder="Поиск наставника..."
                  emptyMessage="Наставник не найден"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-head">Руководитель отдела</FieldLabel>
                <SearchableCombobox
                  id="plan-head"
                  value={departmentHeadId}
                  onValueChange={setDepartmentHeadId}
                  options={toUserOptions(departmentHeads)}
                  placeholder="Выберите руководителя"
                  searchPlaceholder="Поиск руководителя..."
                  emptyMessage="Руководитель не найден"
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
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PlanCreateDialog;
