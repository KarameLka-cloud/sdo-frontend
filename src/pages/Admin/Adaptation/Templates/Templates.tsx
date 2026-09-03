import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateAdaptationPlanTemplateMutation,
  useDeleteAdaptationPlanTemplateMutation,
  useGetAdaptationPlanTemplatesQuery,
} from "@/services/store/features/adaptation.ts";
import { truncateText } from "@/utils/truncateText.ts";
import ResourceListPage, {
  type ResourceColumn,
} from "@/components/resource-list/ResourceListPage";
import ResourceTableRowActions from "@/components/resource-list/ResourceTableRowActions";
import {
  TEMPLATE_ROUTES,
  buildEditPath,
} from "@/components/resource-list/resourceRoutes";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import TemplateCreateDialog from "@/pages/Admin/Adaptation/Templates/TemplateCreateDialog";
import { AdaptationPlanTemplateType } from "@/interfaces/api/AdaptationPlanTemplateType.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { formatShifts } from "@/utils/formatShifts.ts";
import { TEMPLATE_DELETE_MESSAGES } from "@/constants/deleteMessages.ts";

const COLUMNS: ResourceColumn<AdaptationPlanTemplateType>[] = [
  {
    key: "name",
    label: "Название",
    className: "font-medium",
    cellTitle: (template) => template.name,
    render: (template) => truncateText(template.name),
  },
  {
    key: "work_schedule",
    label: "График",
    render: (template) => template.work_schedule,
  },
  {
    key: "shifts",
    label: "Смена",
    render: (template) => formatShifts(template.shifts),
  },
];

function Templates(): JSX.Element {
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetAdaptationPlanTemplatesQuery(undefined);
  const [createTemplate] = useCreateAdaptationPlanTemplateMutation();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copyingId, setCopyingId] = useState<number | null>(null);
  const { handleDelete, isDeletingItem } = useConfirmDelete(
    useDeleteAdaptationPlanTemplateMutation(),
    { messages: TEMPLATE_DELETE_MESSAGES },
  );

  const handleCopy = async (template: AdaptationPlanTemplateType) => {
    setCopyingId(template.id);
    try {
      await createTemplate({
        name: `${template.name} (копия)`,
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

  const filteredTemplates = useFiltered(data, search);

  return (
    <ResourceListPage
      searchId="templates-search"
      searchPlaceholder="Название, график, смена..."
      search={search}
      onSearchChange={setSearch}
      onCreate={() => setIsCreateOpen(true)}
      createLabel="Создать план"
      isLoading={isLoading}
      isError={isError}
      hasData={Boolean(data)}
      items={filteredTemplates}
      columns={COLUMNS}
      getRowKey={(template) => template.id}
      onRowClick={(template) =>
        navigate(buildEditPath(TEMPLATE_ROUTES.edit, template.id))
      }
      renderActions={(template) => (
        <ResourceTableRowActions
          editPath={buildEditPath(TEMPLATE_ROUTES.edit, template.id)}
          onCopy={() => void handleCopy(template)}
          onDelete={() => handleDelete(template)}
          isDeleting={isDeletingItem(template.id)}
          isCopying={copyingId === template.id}
        />
      )}
      notFoundMessage={`План «${search}» не найден`}
    >
      <TemplateCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </ResourceListPage>
  );
}

export default Templates;
