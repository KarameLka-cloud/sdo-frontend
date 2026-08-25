import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import ResourceListToolbar from "@/components/resource-list/ResourceListToolbar";
import ResourceTableRowActions from "@/components/resource-list/ResourceTableRowActions";
import ResourceTableEmptyRow from "@/components/resource-list/ResourceTableEmptyRow";
import QueryState from "@/components/resource-list/QueryState";
import {
  TEMPLATE_ROUTES,
  buildEditPath,
} from "@/components/resource-list/resourceRoutes";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import TemplateCreateDialog from "@/pages/Admin/Adaptation/Templates/TemplateCreateDialog";
import { AdaptationPlanTemplateType } from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { formatShifts } from "@/utils/formatShifts.ts";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copyingId, setCopyingId] = useState<number | null>(null);
  const { handleDelete, isDeletingItem } = useConfirmDelete(deleteMutation, {
    messages: DELETE_MESSAGES,
  });

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

  const hasSearch = search.trim().length > 0;
  const filteredTemplates = useFiltered<AdaptationPlanTemplateType>(
    data,
    search,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ResourceListToolbar
        onCreate={() => setIsCreateOpen(true)}
        createLabel="Создать план"
        searchId="templates-search"
        searchPlaceholder="Название, график, смена..."
        search={search}
        onSearchChange={setSearch}
      />

      <QueryState isLoading={isLoading} isError={isError} hasData={Boolean(data)}>
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
              <ResourceTableEmptyRow
                colSpan={4}
                hasSearch={hasSearch}
                notFoundMessage={`План «${search}» не найден`}
              />
            ) : (
              filteredTemplates.map((template) => {
                const editPath = buildEditPath(
                  TEMPLATE_ROUTES.edit,
                  template.id,
                );

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
                    <TableCell>{formatShifts(template.shifts)}</TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <ResourceTableRowActions
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
      </QueryState>

      <TemplateCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}

export default Templates;
