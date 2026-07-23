import { JSX, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {
  LearningCategory,
  LearningItemType,
  LearningType,
} from "@/interfaces/api/LearningItemType.ts";
import DataMessage, {
  DataStateCenter,
} from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
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
} from "@/components/ui/table";
import AdminListToolbar from "@/pages/Admin/shared/components/AdminListToolbar";
import AdminTableRowActions from "@/pages/Admin/shared/components/AdminTableRowActions";
import AdminTableEmptyRow from "@/pages/Admin/shared/components/AdminTableEmptyRow";
import { useAdminListDelete } from "@/pages/Admin/shared/useAdminListDelete.ts";
import {
  buildAdminLearningCreatePath,
  buildAdminLearningEditPath,
  buildAdminLearningPath,
  isLearningCategory,
  isLearningType,
  isValidLearningPair,
  LEARNING_TYPE_LABELS,
} from "@/constants/learning.ts";

const DELETE_MESSAGES: Record<
  LearningType,
  { confirm: string; success: string; error: string }
> = {
  event: {
    confirm: "Удалить мероприятие?",
    success: "Мероприятие удалено",
    error: "Не удалось удалить мероприятие",
  },
  course: {
    confirm: "Удалить курс?",
    success: "Курс удалён",
    error: "Не удалось удалить курс",
  },
  webinar: {
    confirm: "Удалить вебинар?",
    success: "Вебинар удалён",
    error: "Не удалось удалить вебинар",
  },
  test: {
    confirm: "Удалить тест?",
    success: "Тест удалён",
    error: "Не удалось удалить тест",
  },
};

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
  const { handleDelete, isDeletingItem } = useAdminListDelete<LearningItemType>(
    deleteMutation,
    DELETE_MESSAGES[type],
  );

  const filteredData = useFiltered<LearningItemType>(data, search);
  const hasSearch = search.trim().length > 0;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${LEARNING_TYPE_LABELS[type]} - СДО`;
    return () => {
      document.title = previousTitle;
    };
  }, [type]);

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
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminListToolbar
        createTo={buildAdminLearningCreatePath(category, type)}
        createLabel={CREATE_LABELS[type]}
        searchId={`${type}-search`}
        searchPlaceholder="Поиск..."
        search={search}
        onSearchChange={setSearch}
      />

      {error && <DataMessage type="error" centered />}
      {isLoading && (
        <DataStateCenter>
          <Loader />
        </DataStateCenter>
      )}

      {data && (
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
              <AdminTableEmptyRow
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
                        title={column.key === "title" ? item.title : undefined}
                      >
                        {renderCell(item, column.key)}
                      </TableCell>
                    ))}
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <AdminTableRowActions
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
      )}
    </div>
  );
}

function AdminLearningListPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const typeParam = searchParams.get("type");

  if (!isLearningCategory(categoryParam) || !isLearningType(typeParam)) {
    return (
      <Navigate to={buildAdminLearningPath("education", "event")} replace />
    );
  }

  if (!isValidLearningPair(categoryParam, typeParam)) {
    return (
      <Navigate to={buildAdminLearningPath(categoryParam, "event")} replace />
    );
  }

  return <AdminLearningListContent category={categoryParam} type={typeParam} />;
}

export default AdminLearningListPage;
