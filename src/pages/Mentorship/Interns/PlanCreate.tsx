import { FormEvent, JSX, useState } from "react";
import { toast } from "sonner";
import {
  useCreateAdaptationPlanMutation,
  useGetAdaptationPlanTemplatesQuery,
  useGetDepartmentHeadsQuery,
  useGetMentorsQuery,
  useGetUsersQuery,
} from "@/services/store/features/user.ts";
import { UserType } from "@/interfaces/api/UserType.ts";
import { isUserInRole, USER_ROLES } from "@/constants/roles.ts";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
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
import AdminFormPage from "@/pages/Admin/shared/components/AdminFormPage";
import { INTERNSHIP_ROUTES } from "@/pages/Admin/shared/adminResourceConfig.ts";

interface AdaptationTemplate {
  id: number;
  name: string;
  work_schedule: string;
  shifts: number[];
}

const resolveRoleUsers = (
  fromApi: UserType[] | undefined,
  allUsers: UserType[],
  role: (typeof USER_ROLES)[keyof typeof USER_ROLES],
) => {
  const list = (fromApi ?? []) as UserType[];
  return list.length
    ? list
    : allUsers.filter((user) => isUserInRole(user, role));
};

const sortTemplates = (a: AdaptationTemplate, b: AdaptationTemplate) => {
  const shiftA = Math.min(...a.shifts);
  const shiftB = Math.min(...b.shifts);
  return shiftA !== shiftB
    ? shiftA - shiftB
    : a.name.localeCompare(b.name, "ru");
};

function PlanCreate(): JSX.Element {
  const [createAdaptationPlan, { isLoading: isCreating }] =
    useCreateAdaptationPlanMutation();
  const { data: usersData, isLoading: isUsersLoading } =
    useGetUsersQuery(undefined);
  const { data: templatesData, isLoading: isTemplatesLoading } =
    useGetAdaptationPlanTemplatesQuery(undefined);
  const { data: mentorsData } = useGetMentorsQuery(undefined);
  const { data: departmentHeadsData } = useGetDepartmentHeadsQuery(undefined);

  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [workSchedule, setWorkSchedule] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [departmentHeadId, setDepartmentHeadId] = useState("");

  const users = (usersData ?? []) as UserType[];
  const templates = (templatesData ?? []) as AdaptationTemplate[];
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

    const selectedShift = [...template.shifts].sort((a, b) => a - b)[0];
    if (!selectedShift) {
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
    } catch {
      toast.error("Не удалось создать план адаптации");
    }
  };

  return (
    <AdminFormPage
      backTo={INTERNSHIP_ROUTES.list}
      backLabel="К списку стажеров"
      isLoading={isUsersLoading || isTemplatesLoading}
    >
      <Card>
        <CardHeader>
          <CardTitle>Создание плана адаптации</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4">
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="plan-user">Стажер</FieldLabel>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger id="plan-user" className="w-full">
                    <SelectValue placeholder="Выберите пользователя" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((user) => user.id != null)
                      .map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-start-date">
                  Дата начала стажировки
                </FieldLabel>
                <Input
                  id="plan-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
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
                  <SelectContent>
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
                  <SelectContent>
                    {filteredTemplates.map((template) => (
                      <SelectItem key={template.id} value={String(template.id)}>
                        {template.name} (смена:{" "}
                        {[...template.shifts].sort((a, b) => a - b).join(", ")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-mentor">Наставник</FieldLabel>
                <Select value={mentorId} onValueChange={setMentorId}>
                  <SelectTrigger id="plan-mentor" className="w-full">
                    <SelectValue placeholder="Выберите наставника" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors
                      .filter((mentor) => mentor.id != null)
                      .map((mentor) => (
                        <SelectItem key={mentor.id} value={String(mentor.id)}>
                          {mentor.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-head">Руководитель отдела</FieldLabel>
                <Select
                  value={departmentHeadId}
                  onValueChange={setDepartmentHeadId}
                >
                  <SelectTrigger id="plan-head" className="w-full">
                    <SelectValue placeholder="Выберите руководителя" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentHeads
                      .filter((head) => head.id != null)
                      .map((head) => (
                        <SelectItem key={head.id} value={String(head.id)}>
                          {head.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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

export default PlanCreate;
