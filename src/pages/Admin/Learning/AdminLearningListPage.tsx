import { JSX, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import ResourceListToolbar from "@/components/resource-list/ResourceListToolbar";
import ResourceTableRowActions from "@/components/resource-list/ResourceTableRowActions";
import ResourceTableEmptyRow from "@/components/resource-list/ResourceTableEmptyRow";
import QueryState from "@/components/resource-list/QueryState";
import { useConfirmDelete } from "@/components/resource-list/useConfirmDelete";
import {
  LEARNING_DELETE_MESSAGES,
  LEARNING_TYPE_LABELS,
  buildAdminLearningCreatePath,
  buildAdminLearningEditPath,
  buildAdminLearningPath,
} from "@/constants/learning.ts";
import { useResolvedLearningRoute } from "@/hooks/useResolvedLearningRoute.ts";
import PageTitle from "@/components/PageTitle.tsx";

const CREATE_LABELS: Record<LearningType, string> = {
  event: "Создать мероприятие",
  course: "Создать курс",
  webinar: "Создать вебинар",
  test: "Создать тест",
};

function AdminLearningListContent({
  category,
  type,
}: {
  category: LearningCategory;
  type: LearningType;
}): JSX.Element {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetLearningItemsQuery({
    category,
    type,
  });
  const deleteMutation = useDeleteLearningItemMutation();
  const [search, setSearch] = useState("");
  const { handleDelete, isDeletingItem } = useConfirmDelete(deleteMutation, {
    messages: LEARNING_DELETE_MESSAGES[type],
  });

  const filteredData = useFiltered<LearningItemType>(data, search);
  const hasSearch = search.trim().length > 0;

  const columns = useMemo(() => {
    switch (type) {
      case "event":
        return [
          { key: "title", label: "Название" },
          { key: "department", label: "Отдел" },
          { key: "date", label: "Дата" },
          { key: "time", label: "Время" },
          { key: "duration", label: "Длительность" },
        ];
      case "course":
        return [
          { key: "title", label: "Название" },
          { key: "department", label: "Отдел" },
          { key: "duration", label: "Длительность" },
          { key: "date", label: "Пройти до" },
        ];
      case "webinar":
        return [
          { key: "title", label: "Название" },
          { key: "date", label: "Дата" },
          { key: "time", label: "Время" },
          { key: "duration", label: "Длительность" },
        ];
      case "test":
        return [
          { key: "title", label: "Название" },
          { key: "position", label: "Должность" },
          { key: "duration", label: "Длительность" },
          { key: "date", label: "Пройти до" },
        ];
    }
  }, [type]);

  const renderCell = (item: LearningItemType, key: string) => {
    switch (key) {
      case "title":
        return truncateText(item.title);
      case "department":
        return item.department;
      case "position":
        return item.position;
      case "date":
        return convertDate(item.date);
      case "time":
        return hasTextValue(item.time) ? convertTime(item.time!) : null;
      case "duration":
        return `${item.duration} мин.`;
      default:
        return null;
    }
  };

  return (
    <PageTitle
      title={LEARNING_TYPE_LABELS[type]}
      element={
        <div className="flex min-h-0 flex-1 flex-col">
          <ResourceListToolbar
            createTo={buildAdminLearningCreatePath(category, type)}
            createLabel={CREATE_LABELS[type]}
            searchId={`${type}-search`}
            searchPlaceholder="Поиск..."
            search={search}
            onSearchChange={setSearch}
          />

          <QueryState
            isLoading={isLoading}
            isError={Boolean(error)}
            hasData={Boolean(data)}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <ResourceTableEmptyRow
                    colSpan={columns.length + 1}
                    hasSearch={hasSearch}
                    notFoundMessage={`«${search}» не найдено`}
                  />
                ) : (
                  filteredData.map((item) => {
                    const editPath = buildAdminLearningEditPath(
                      item.id,
                      category,
                      type,
                    );

                    return (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => navigate(editPath)}
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={column.key}
                            className={
                              column.key === "title" ? "font-medium" : undefined
                            }
                            title={
                              column.key === "title" ? item.title : undefined
                            }
                          >
                            {renderCell(item, column.key)}
                          </TableCell>
                        ))}
                        <TableCell
                          className="text-right"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <ResourceTableRowActions
                            editPath={editPath}
                            onDelete={() => handleDelete(item)}
                            isDeleting={isDeletingItem(item.id)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </QueryState>
        </div>
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
    <AdminLearningListContent category={route.category} type={route.type} />
  );
}

export default AdminLearningListPage;
