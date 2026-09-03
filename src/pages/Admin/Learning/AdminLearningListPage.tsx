import { JSX, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  LearningCategory,
  LearningItemType,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import { useFiltered } from "@/hooks/useFiltered.ts";
import convertDate from "@/utils/convertDate.ts";
import { truncateText } from "@/utils/truncateText.ts";
import { convertTime } from "@/utils/convertTime.ts";
import { hasTextValue } from "@/utils/hasTextValue.ts";
import {
  useDeleteLearningItemMutation,
  useGetLearningItemsQuery,
} from "@/services/store/features/learningItems.ts";
import ResourceListPage, {
  type ResourceColumn,
} from "@/components/resource-list/ResourceListPage";
import ResourceTableRowActions from "@/components/resource-list/ResourceTableRowActions";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import {
  LEARNING_DELETE_MESSAGES,
  LEARNING_TYPE_LABELS,
  buildAdminLearningPath,
} from "@/constants/learning.ts";
import { useResolvedLearningRoute } from "@/hooks/useResolvedLearningRoute.ts";
import PageTitle from "@/components/PageTitle.tsx";
import LearningItemFormDialog from "@/pages/Admin/Learning/LearningItemFormDialog";

const CREATE_LABELS: Record<LearningType, string> = {
  event: "Создать мероприятие",
  course: "Создать курс",
  webinar: "Создать вебинар",
  test: "Создать тест",
};

const COLUMN_DEFS = {
  title: {
    key: "title",
    label: "Название",
    className: "font-medium",
    cellTitle: (item: LearningItemType) => item.title,
    render: (item: LearningItemType) => truncateText(item.title),
  },
  department: {
    key: "department",
    label: "Отдел",
    render: (item: LearningItemType) => item.department,
  },
  position: {
    key: "position",
    label: "Должность",
    render: (item: LearningItemType) => item.position,
  },
  date: {
    key: "date",
    label: "Дата",
    render: (item: LearningItemType) => convertDate(item.date),
  },
  deadline: {
    key: "date",
    label: "Пройти до",
    render: (item: LearningItemType) => convertDate(item.date),
  },
  time: {
    key: "time",
    label: "Время",
    render: (item: LearningItemType) =>
      hasTextValue(item.time) ? convertTime(item.time!) : null,
  },
  duration: {
    key: "duration",
    label: "Длительность",
    render: (item: LearningItemType) => `${item.duration} мин.`,
  },
} satisfies Record<string, ResourceColumn<LearningItemType>>;

const COLUMNS_BY_TYPE: Record<
  LearningType,
  ResourceColumn<LearningItemType>[]
> = {
  event: [
    COLUMN_DEFS.title,
    COLUMN_DEFS.department,
    COLUMN_DEFS.date,
    COLUMN_DEFS.time,
    COLUMN_DEFS.duration,
  ],
  course: [
    COLUMN_DEFS.title,
    COLUMN_DEFS.department,
    COLUMN_DEFS.duration,
    COLUMN_DEFS.deadline,
  ],
  webinar: [
    COLUMN_DEFS.title,
    COLUMN_DEFS.date,
    COLUMN_DEFS.time,
    COLUMN_DEFS.duration,
  ],
  test: [
    COLUMN_DEFS.title,
    COLUMN_DEFS.position,
    COLUMN_DEFS.duration,
    COLUMN_DEFS.deadline,
  ],
};

function AdminLearningListContent({
  category,
  type,
}: {
  category: LearningCategory;
  type: LearningType;
}): JSX.Element {
  const { data, error, isLoading } = useGetLearningItemsQuery({
    category,
    type,
  });
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LearningItemType | null>(null);
  const { handleDelete, isDeletingItem } = useConfirmDelete(
    useDeleteLearningItemMutation(),
    { messages: LEARNING_DELETE_MESSAGES[type] },
  );

  const filteredData = useFiltered<LearningItemType>(data, search);

  const openCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: LearningItemType) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  return (
    <PageTitle
      title={LEARNING_TYPE_LABELS[type]}
      element={
        <ResourceListPage
          searchId={`${type}-search`}
          searchPlaceholder="Поиск..."
          search={search}
          onSearchChange={setSearch}
          onCreate={openCreate}
          createLabel={CREATE_LABELS[type]}
          isLoading={isLoading}
          isError={Boolean(error)}
          hasData={Boolean(data)}
          items={filteredData}
          columns={COLUMNS_BY_TYPE[type]}
          getRowKey={(item) => item.id}
          onRowClick={openEdit}
          renderActions={(item) => (
            <ResourceTableRowActions
              onEdit={() => openEdit(item)}
              onDelete={() => handleDelete(item)}
              isDeleting={isDeletingItem(item.id)}
            />
          )}
          notFoundMessage={`«${search}» не найдено`}
        >
          <LearningItemFormDialog
            open={isFormOpen}
            onOpenChange={(open) => {
              setIsFormOpen(open);
              if (!open) setEditingItem(null);
            }}
            category={category}
            type={type}
            item={editingItem}
          />
        </ResourceListPage>
      }
    />
  );
}

function AdminLearningListPage(): JSX.Element {
  const route = useResolvedLearningRoute(buildAdminLearningPath);

  if ("redirect" in route) {
    return <Navigate to={route.redirect} replace />;
  }

  return (
    <AdminLearningListContent
      key={`${route.category}-${route.type}`}
      category={route.category}
      type={route.type}
    />
  );
}

export default AdminLearningListPage;
