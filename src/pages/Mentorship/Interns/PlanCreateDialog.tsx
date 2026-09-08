import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateAdaptationPlanMutation,
  useGetAdaptationPlanTemplatesQuery,
} from "@/services/store/features/adaptation.ts";
import {
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetSupervisorsQuery,
  useGetUsersQuery,
} from "@/services/store/features/users.ts";
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
import { DialogFooter } from "@/components/ui/shadcn/dialog";
import FormDialog from "@/components/ui/custom/FormDialog";
import SearchableCombobox from "@/components/ui/custom/SearchableCombobox";
import RoleUserCombobox from "@/components/ui/custom/RoleUserCombobox";
import DatePickerField from "@/components/ui/custom/DatePickerField";
import { AdaptationPlanTemplateType } from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import { resolveRoleUsers } from "@/utils/resolveRoleUsers.ts";
import { firstShift, formatShifts } from "@/utils/formatShifts.ts";
import { toUserOptions } from "@/utils/userSelectOptions.ts";
import { toastMutationError } from "@/utils/apiError.ts";

const sortTemplates = (
  a: AdaptationPlanTemplateType,
  b: AdaptationPlanTemplateType,
) => {
  const shiftA = firstShift(a.shifts) ?? 0;
  const shiftB = firstShift(b.shifts) ?? 0;
  return shiftA !== shiftB
    ? shiftA - shiftB
    : a.name.localeCompare(b.name, "ru");
};

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
  const { data: supervisorsData } = useGetSupervisorsQuery(undefined, {
    skip: !open,
  });
  const { data: departmentHeadsData } = useGetDepartmentHeadsQuery(undefined, {
    skip: !open,
  });

  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [workSchedule, setWorkSchedule] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [departmentHeadId, setDepartmentHeadId] = useState("");

  const users = usersData ?? [];
  const templates = templatesData ?? [];
  const mentors = resolveRoleUsers(mentorsData, users, USER_ROLES.MENTOR);
  const supervisors = resolveRoleUsers(
    supervisorsData,
    users,
    USER_ROLES.SUPERVISOR,
  );
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
      setSupervisorId("");
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
    if (!supervisorId) return toast.error("Выберите руководителя отделения");
    if (!departmentHeadId) {
      return toast.error("Выберите начальника отдела");
    }

    try {
      await createAdaptationPlan({
        user_id: Number(userId),
        start_date: startDate,
        adaptation_plan_template_id: Number(templateId),
        shift: selectedShift,
        mentor: Number(mentorId),
        supervisor: Number(supervisorId),
        department_head: Number(departmentHeadId),
      }).unwrap();
      toast.success("План адаптации создан");
      onOpenChange(false);
    } catch (error) {
      toastMutationError(error, "Не удалось создать план адаптации");
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Создание плана адаптации"
      description="Заполните данные стажера, шаблон и ответственных для нового плана"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
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
              <FieldLabel htmlFor="plan-template">Шаблон адаптации</FieldLabel>
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
                      {template.name} (смена: {formatShifts(template.shifts)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <RoleUserCombobox
              field="mentor"
              value={mentorId}
              onValueChange={setMentorId}
              users={mentors}
            />
            <RoleUserCombobox
              field="supervisor"
              value={supervisorId}
              onValueChange={setSupervisorId}
              users={supervisors}
            />
            <RoleUserCombobox
              field="departmentHead"
              value={departmentHeadId}
              onValueChange={setDepartmentHeadId}
              users={departmentHeads}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isCreating}>
            {isCreating && <Spinner />}
            Создать план
          </Button>
        </DialogFooter>
      </form>
    </FormDialog>
  );
}

export default PlanCreateDialog;
