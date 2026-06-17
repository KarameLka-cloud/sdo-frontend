import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CourseType } from "@/interfaces/api/CourseType.ts";
import DataMessage from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import { useFiltered } from "@/hooks/useFiltered.ts";
import convertDate from "@/utils/convertDate.ts";
import { truncateText } from "@/utils/truncateText.ts";
import {
  useGetEducationCoursesQuery,
  useDeleteEducationCourseMutation,
} from "@/services/store/features/education.ts";
import {
  useGetEdoCoursesQuery,
  useDeleteEdoCourseMutation,
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
  COURSE_ROUTES,
} from "@/pages/Admin/shared/adminResourceConfig.ts";
import { useAdminListDelete } from "@/pages/Admin/shared/useAdminListDelete.ts";

const HOOKS = {
  education: {
    useGetQuery: useGetEducationCoursesQuery,
    useDeleteMutation: useDeleteEducationCourseMutation,
  },
  edo: {
    useGetQuery: useGetEdoCoursesQuery,
    useDeleteMutation: useDeleteEdoCourseMutation,
  },
} as const;

const DELETE_MESSAGES = {
  confirm: "Удалить курс?",
  success: "Курс удалён",
  error: "Не удалось удалить курс",
};

function AdminCoursesPage({ domain }: { domain: AdminDomain }): JSX.Element {
  const routes = COURSE_ROUTES[domain];
  const { useGetQuery, useDeleteMutation } = HOOKS[domain];
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetQuery("");
  const deleteMutation = useDeleteMutation();
  const [search, setSearch] = useState("");
  const { handleDelete, isDeletingItem } = useAdminListDelete<CourseType>(
    deleteMutation,
    DELETE_MESSAGES,
  );

  const filteredData = useFiltered<CourseType>(data, search);
  const hasSearch = search.trim().length > 0;

  return (
    <>
      <AdminListToolbar
        createTo={routes.create}
        createLabel="Создать курс"
        searchId="courses-search"
        searchPlaceholder="Название, отдел, ссылка..."
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
              <TableHead>Пройти до</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={4}
                hasSearch={hasSearch}
                notFoundMessage={`Курс «${search}» не найден`}
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
                    <TableCell>{convertDate(item.date_end)}</TableCell>
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

export default AdminCoursesPage;
