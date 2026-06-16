import { ChangeEvent, FormEvent, JSX, useMemo, useState } from "react";
import IconButton from "@/components/ui/custom/IconButton";
import DataMessage from "@/components/ui/custom/DataMessage";
import Input from "@/components/ui/custom/Input";
import ButtonSubmit from "@/components/ui/custom/ButtonSubmit";
import Loader from "@/components/ui/custom/Loader";
import { useNavigate } from "react-router-dom";
import {
  useCreateAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplatesQuery,
} from "@/services/store/features/user.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import FormActionStatus from "@/components/ui/custom/FormActionStatus";

interface AdaptationPlanTemplateType {
  id: number;
  name: string;
  work_schedule: string;
  shifts: number[];
}

type StatusType = "idle" | "loading" | "success" | "error";

function Templates(): JSX.Element {
  const navigate = useNavigate();
  const {
    data = [],
    isLoading,
    isError,
  } = useGetAdaptationPlanTemplatesQuery(undefined);
  const [createTemplate, { isLoading: isCreating }] =
    useCreateAdaptationPlanTemplateMutation();

  const templates = data as AdaptationPlanTemplateType[];

  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("idle");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    workSchedule: "",
    shift: "",
  });
  const hasSearch = search.trim().length > 0;
  const filteredTemplates = useMemo(() => {
    if (!hasSearch) {
      return templates;
    }

    const searchLower = search.toLowerCase();
    return templates.filter((template) => {
      const templateName = template.name.toLowerCase();
      const workSchedule = template.work_schedule.toLowerCase();
      const shifts = template.shifts.join(",");
      return (
        templateName.includes(searchLower) ||
        workSchedule.includes(searchLower) ||
        shifts.includes(searchLower)
      );
    });
  }, [hasSearch, search, templates]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setStatusType("error");
      setStatus("Укажите название шаблона.");
      return;
    }
    if (!form.workSchedule) {
      setStatusType("error");
      setStatus("Выберите график работы.");
      return;
    }
    if (!form.shift) {
      setStatusType("error");
      setStatus("Укажите корректный номер смены.");
      return;
    }
    try {
      setStatusType("loading");
      setStatus(FORM_STATUS_MESSAGES.createLoading);
      await createTemplate({
        name: form.name.trim(),
        work_schedule: form.workSchedule,
        shifts: [Number(form.shift)],
      }).unwrap();
      setForm({
        name: "",
        workSchedule: "",
        shift: "",
      });
      setStatusType("success");
      setStatus(FORM_STATUS_MESSAGES.createSuccess);
    } catch {
      setStatusType("error");
      setStatus(FORM_STATUS_MESSAGES.createError);
    }
  };

  return (
    <div className="flex flex-col gap-[0.9rem]">
      <div className="sticky top-[var(--mfc-sticky-panel-top)] z-[var(--mfc-sticky-panel-z-index)] mb-[var(--mfc-sticky-panel-margin-bottom)] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-[0.8rem] rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-sticky-panel-bg)] p-[var(--mfc-sticky-panel-padding)] max-[900px]:flex-col max-[900px]:items-stretch">
          <div className="flex items-center gap-3 max-[900px]:w-full">
            {isCreateVisible ? (
              <IconButton
                type="close"
                onClick={() => setIsCreateVisible(false)}
              />
            ) : (
              <IconButton
                type="edit"
                onClick={() => setIsCreateVisible(true)}
              />
            )}
          </div>
          <Input
            type={"text"}
            name={"search"}
            placeholder={"🔎"}
            className="w-[40%] max-w-md max-[900px]:w-full max-[900px]:max-w-none"
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setSearch(event.target.value)
            }
          />
        </div>
        {isCreateVisible && (
          <form
            className="flex flex-col gap-[0.7rem] rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-create-form-bg)] p-[0.9rem]"
            onSubmit={handleCreate}
          >
            <div className="flex flex-col">
              <Input
                type="text"
                name="name"
                className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                placeholder="Название шаблона"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <select
                className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                value={form.workSchedule}
                onChange={(e) =>
                  setForm({ ...form, workSchedule: e.target.value })
                }
              >
                <option value="" disabled>
                  График работы
                </option>
                <option value="5/2">5/2</option>
                <option value="2/2">2/2</option>
              </select>
            </div>
            <div className="flex flex-col">
              <Input
                type="number"
                name="shift"
                min={1}
                step={1}
                className="box-border h-9 rounded-lg border border-[var(--mfc-create-field-border)] px-[0.7rem] py-[0.55rem] text-sm leading-tight"
                placeholder="Смена"
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 max-[900px]:flex-col max-[900px]:items-start">
              <ButtonSubmit loading={isCreating}>Создать</ButtonSubmit>
              <FormActionStatus type={statusType} message={status} />
            </div>
          </form>
        )}
      </div>
      {isLoading && <Loader />}
      {isError && <DataMessage type="error" />}
      {!isLoading && !isError && templates.length === 0 && (
        <DataMessage type="noData" />
      )}
      {!isLoading && !isError && templates.length > 0 && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-create-form-bg)] p-[0.9rem]"
            >
              <div className="flex-1 text-left">
                <p className="mb-[0.3rem] text-base font-semibold">
                  {template.name}
                </p>
                <p className="mb-[0.2rem] text-[var(--mfc-gray-color)]">
                  График: {template.work_schedule}
                </p>
                <p className="mb-[0.2rem] text-[var(--mfc-gray-color)]">
                  Смены: {template.shifts.join(", ")}
                </p>
              </div>
              <IconButton
                type="edit"
                onClick={() =>
                  navigate(`/admin/adaptation/templates/${template.id}`)
                }
                className="self-center"
              />
            </div>
          ))}
          {hasSearch && filteredTemplates.length === 0 && (
            <p className="mx-auto mt-2 w-fit rounded-xl border border-[var(--mfc-create-field-border)] bg-[var(--mfc-surface-color)] px-4 py-3 text-center text-[var(--mfc-gray-color)]">
              Шаблон "{search}" не найден
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Templates;
