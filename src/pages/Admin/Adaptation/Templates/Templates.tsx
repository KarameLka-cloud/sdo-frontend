import { JSX, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DataMessage, { DataStateCenter } from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import {
  useCreateAdaptationPlanTemplateMutation,
  useDeleteAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplatesQuery,
} from "@/services/store/features/user.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { truncateText } from "@/utils/truncateText.ts";
import AdminListToolbar from "@/pages/Admin/shared/components/AdminListToolbar";
import AdminTableRowActions from "@/pages/Admin/shared/components/AdminTableRowActions";
import AdminTableEmptyRow from "@/pages/Admin/shared/components/AdminTableEmptyRow";
import {
  TEMPLATE_ROUTES,
  buildEditPath,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminListDelete } from "@/pages/Admin/shared/useAdminListDelete.ts";

interface AdaptationPlanTemplateType {
  id: number;
  name: string;
  work_schedule: string;
  shifts: number[];
  task_blueprint?: Array<{
    description: string;
    responsible_role: string;
    day_from?: number | null;
    day_to?: number | null;
    links?: string[];
  }>;
}

const buildCopyName = (name: string) => `${name} (копия)`;

const DELETE_MESSAGES = {
  confirm: "Удалить план адаптации?",
  success: "План адаптации удалён",
  error: "Не удалось удалить план адаптации",
};

function Templates(): JSX.Element {
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetAdaptationPlanTemplatesQuery(undefined);
  const [createTemplate] = useCreateAdaptationPlanTemplateMutation();
  const deleteMutation = useDeleteAdaptationPlanTemplateMutation();
  const [search, setSearch] = useState("");
  const [copyingId, setCopyingId] = useState<number | null>(null);
  const { handleDelete, isDeletingItem } =
    useAdminListDelete<AdaptationPlanTemplateType>(
      deleteMutation,
      DELETE_MESSAGES,
    );

  const handleCopy = async (template: AdaptationPlanTemplateType) => {
    setCopyingId(template.id);
    try {
      await createTemplate({
        name: buildCopyName(template.name),
        work_schedule: template.work_schedule,
        shifts: template.shifts,
        task_blueprint: template.task_blueprint ?? [],
      }).unwrap();
      toast.success("Копия плана создана");
    } catch {
      toast.error("Не удалось создать копию плана");
    } finally {
      setCopyingId(null);
    }
  };

  const templates = (data ?? []) as AdaptationPlanTemplateType[];
  const hasSearch = search.trim().length > 0;

  const filteredTemplates = useMemo(() => {
    if (!hasSearch) return templates;

    const searchLower = search.toLowerCase();
    return templates.filter((template) => {
      const values = [
        template.name,
        template.work_schedule,
        template.shifts.join(", "),
      ];
      return values.some((value) =>
        String(value).toLowerCase().includes(searchLower),
      );
    });
  }, [hasSearch, search, templates]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminListToolbar
        createTo={TEMPLATE_ROUTES.create}
        createLabel="Создать план"
        searchId="templates-search"
        searchPlaceholder="Название, график, смена..."
        search={search}
        onSearchChange={setSearch}
      />

      {isError && <DataMessage type="error" centered />}
      {isLoading && (
        <DataStateCenter>
          <Loader />
        </DataStateCenter>
      )}

      {data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>График</TableHead>
              <TableHead>Смена</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={4}
                hasSearch={hasSearch}
                notFoundMessage={`План «${search}» не найден`}
              />
            ) : (
              filteredTemplates.map((template) => {
                const editPath = buildEditPath(TEMPLATE_ROUTES.edit, template.id);

                return (
                  <TableRow
                    key={template.id}
                    className="cursor-pointer"
                    onClick={() => navigate(editPath)}
                  >
                    <TableCell className="font-medium" title={template.name}>
                      {truncateText(template.name)}
                    </TableCell>
                    <TableCell>{template.work_schedule}</TableCell>
                    <TableCell>
                      {[...template.shifts].sort((a, b) => a - b).join(", ")}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <AdminTableRowActions
                        editPath={editPath}
                        onCopy={() => void handleCopy(template)}
                        onDelete={() => handleDelete(template)}
                        isDeleting={isDeletingItem(template.id)}
                        isCopying={copyingId === template.id}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Templates;
