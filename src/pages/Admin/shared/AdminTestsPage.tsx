import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestType } from "@/interfaces/api/TestType.ts";
import DataMessage, { DataStateCenter } from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import { useFiltered } from "@/hooks/useFiltered.ts";
import convertDate from "@/utils/convertDate.ts";
import { truncateText } from "@/utils/truncateText.ts";
import {
  useGetEducationTestsQuery,
  useDeleteEducationTestMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoTestsQuery,
  useDeleteEdoTestMutation,
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
  TEST_ROUTES,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminListDelete } from "@/pages/Admin/shared/useAdminListDelete.ts";

const HOOKS = {
  education: {
    useGetQuery: useGetEducationTestsQuery,
    useDeleteMutation: useDeleteEducationTestMutation,
  },
  edo: {
    useGetQuery: useGetEdoTestsQuery,
    useDeleteMutation: useDeleteEdoTestMutation,
  },
} as const;

const DELETE_MESSAGES = {
  confirm: "Удалить тест?",
  success: "Тест удалён",
  error: "Не удалось удалить тест",
};

function AdminTestsPage({ domain }: { domain: AdminDomain }): JSX.Element {
  const routes = TEST_ROUTES[domain];
  const { useGetQuery, useDeleteMutation } = HOOKS[domain];
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetQuery("");
  const deleteMutation = useDeleteMutation();
  const [search, setSearch] = useState("");
  const { handleDelete, isDeletingItem } = useAdminListDelete<TestType>(
    deleteMutation,
    DELETE_MESSAGES,
  );

  const filteredData = useFiltered<TestType>(data, search);
  const hasSearch = search.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminListToolbar
        createTo={routes.create}
        createLabel="Создать тест"
        searchId="tests-search"
        searchPlaceholder="Название, должность, ссылка..."
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
              <TableHead>Название</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Длительность</TableHead>
              <TableHead>Пройти до</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={5}
                hasSearch={hasSearch}
                notFoundMessage={`Тест «${search}» не найден`}
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
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.duration} мин.</TableCell>
                    <TableCell>{convertDate(item.date)}</TableCell>
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

export default AdminTestsPage;
