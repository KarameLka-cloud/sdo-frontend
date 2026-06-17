import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventType } from "@/interfaces/api/EventType.ts";
import DataMessage from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import { useFiltered } from "@/hooks/useFiltered.ts";
import convertDate from "@/utils/convertDate.ts";
import { truncateText } from "@/utils/truncateText.ts";
import { convertTime } from "@/utils/convertTime.ts";
import { hasTextValue } from "@/utils/hasTextValue.ts";
import {
  useGetEducationEventsQuery,
  useDeleteEducationEventMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoEventsQuery,
  useDeleteEdoEventMutation,
} from "@/services/store/features/edo.ts";
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
import {
  AdminDomain,
  buildEditPath,
  EVENT_ROUTES,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminListDelete } from "@/pages/Admin/shared/useAdminListDelete.ts";

const HOOKS = {
  education: {
    useGetQuery: useGetEducationEventsQuery,
    useDeleteMutation: useDeleteEducationEventMutation,
  },
  edo: {
    useGetQuery: useGetEdoEventsQuery,
    useDeleteMutation: useDeleteEdoEventMutation,
  },
} as const;

const DELETE_MESSAGES = {
  confirm: "Удалить мероприятие?",
  success: "Мероприятие удалено",
  error: "Не удалось удалить мероприятие",
};

function AdminEventsPage({ domain }: { domain: AdminDomain }): JSX.Element {
  const routes = EVENT_ROUTES[domain];
  const { useGetQuery, useDeleteMutation } = HOOKS[domain];
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetQuery("");
  const deleteMutation = useDeleteMutation();
  const [search, setSearch] = useState("");
  const { handleDelete, isDeletingItem } = useAdminListDelete<EventType>(
    deleteMutation,
    DELETE_MESSAGES,
  );

  const filteredData = useFiltered<EventType>(data, search);
  const hasSearch = search.trim().length > 0;

  return (
    <>
      <AdminListToolbar
        createTo={routes.create}
        createLabel="Создать мероприятие"
        searchId="events-search"
        searchPlaceholder="Название, отдел, описание..."
        search={search}
        onSearchChange={setSearch}
      />

      {error && <DataMessage type="error" />}
      {isLoading && <Loader />}

      {data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Отдел</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Время</TableHead>
              <TableHead>Длительность</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={6}
                hasSearch={hasSearch}
                notFoundMessage={`Мероприятие «${search}» не найдено`}
              />
            ) : (
              filteredData.map((item) => {
                const editPath = buildEditPath(routes.edit, item.id);

                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => navigate(editPath)}
                  >
                    <TableCell className="font-medium" title={item.title}>
                      {truncateText(item.title)}
                    </TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{convertDate(item.date)}</TableCell>
                    <TableCell>
                      {hasTextValue(item.time) ? convertTime(item.time) : null}
                    </TableCell>
                    <TableCell>{item.duration} мин.</TableCell>
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
    </>
  );
}

export default AdminEventsPage;
