import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebinarType } from "@/interfaces/api/WebinarType.ts";
import DataMessage from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import { useFiltered } from "@/hooks/useFiltered.ts";
import convertDate from "@/utils/convertDate.ts";
import { truncateText } from "@/utils/truncateText.ts";
import { convertTime } from "@/utils/convertTime.ts";
import {
  useGetEducationWebinarsQuery,
  useDeleteEducationWebinarMutation,
} from "@/services/store/features/education.ts";
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
  buildEditPath,
  WEBINAR_ROUTES,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminListDelete } from "@/pages/Admin/shared/useAdminListDelete.ts";

const DELETE_MESSAGES = {
  confirm: "Удалить вебинар?",
  success: "Вебинар удалён",
  error: "Не удалось удалить вебинар",
};

function AdminWebinarsPage(): JSX.Element {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetEducationWebinarsQuery("");
  const deleteMutation = useDeleteEducationWebinarMutation();
  const [search, setSearch] = useState("");
  const { handleDelete, isDeletingItem } = useAdminListDelete<WebinarType>(
    deleteMutation,
    DELETE_MESSAGES,
  );

  const filteredData = useFiltered<WebinarType>(data, search);
  const hasSearch = search.trim().length > 0;

  return (
    <>
      <AdminListToolbar
        createTo={WEBINAR_ROUTES.create}
        createLabel="Создать вебинар"
        searchId="webinars-search"
        searchPlaceholder="Название, дата..."
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
              <TableHead>Дата</TableHead>
              <TableHead>Время</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={4}
                hasSearch={hasSearch}
                notFoundMessage={`Вебинар «${search}» не найден`}
              />
            ) : (
              filteredData.map((item) => {
                const editPath = buildEditPath(WEBINAR_ROUTES.edit, item.id);

                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => navigate(editPath)}
                  >
                    <TableCell className="font-medium" title={item.title}>
                      {truncateText(item.title)}
                    </TableCell>
                    <TableCell>{convertDate(item.date)}</TableCell>
                    <TableCell>
                      {convertTime(item.time_start)}–{convertTime(item.time_end)}
                    </TableCell>
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

export default AdminWebinarsPage;
