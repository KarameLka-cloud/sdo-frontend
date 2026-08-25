import { JSX, useState } from "react";
import DataMessage, {
  DataStateCenter,
} from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";
import { useSearchEmployeesQuery } from "@/services/store/features/employeeDirectory.ts";
import type {
  EmployeeDirectoryAttributes,
  EmployeeDirectoryAttributeKey,
  EmployeeDirectoryEntry,
} from "@/interfaces/api/EmployeeDirectoryType.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import ResourceListToolbar from "@/components/resource-list/ResourceListToolbar";
import ResourceTableEmptyRow from "@/components/resource-list/ResourceTableEmptyRow";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.ts";
import { getInitials } from "@/utils/getInitials.ts";

const DEFAULT_ATTRIBUTES: EmployeeDirectoryAttributes = {
  cn: "Имя:",
  description: "Должность:",
  department: "Отдел:",
  l: "Город:",
  streetaddress: "Адрес:",
  telephonenumber: "Телефон:",
  mail: "Эл. почта:",
};

const ATTRIBUTE_ORDER: EmployeeDirectoryAttributeKey[] = [
  "cn",
  "description",
  "department",
  "l",
  "streetaddress",
  "telephonenumber",
  "mail",
];

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 400;

function photoSrc(photo?: string): string | undefined {
  if (!photo) return undefined;
  return `data:image/jpeg;base64,${photo}`;
}

function EmployeeInfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label.replace(/:$/, "")}</dt>
      <dd className="text-sm font-medium break-words">{value || "—"}</dd>
    </div>
  );
}

function EmployeeDetailDialog({
  employee,
  attributes,
  open,
  onOpenChange,
}: {
  employee: EmployeeDirectoryEntry | null;
  attributes: EmployeeDirectoryAttributes;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar size="lg" className="size-16">
              <AvatarImage
                src={photoSrc(employee.thumbnailphoto)}
                alt={employee.cn ?? "Сотрудник"}
              />
              <AvatarFallback>{getInitials(employee.cn) || "?"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1">
              <DialogTitle className="truncate">
                {employee.cn ?? "Сотрудник"}
              </DialogTitle>
              <DialogDescription>
                {employee.description || employee.department || "Карточка сотрудника"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <dl className="grid gap-4 sm:grid-cols-2">
          {ATTRIBUTE_ORDER.map((key) => (
            <EmployeeInfoItem
              key={key}
              label={attributes[key] ?? DEFAULT_ATTRIBUTES[key]}
              value={employee[key]}
            />
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}

function EmployeeDirectory(): JSX.Element {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const [selected, setSelected] = useState<EmployeeDirectoryEntry | null>(null);

  const canSearch = debouncedSearch.length >= MIN_QUERY_LENGTH;

  const { data, isFetching, isError, isUninitialized } =
    useSearchEmployeesQuery(
      { q: debouncedSearch, withPhoto: true },
      { skip: !canSearch },
    );

  const employees = data?.data ?? [];
  const attributes = data?.attributes ?? DEFAULT_ATTRIBUTES;
  const hasSearch = search.trim().length > 0;
  const showHint = !canSearch;
  const showLoading = canSearch && isFetching;
  const showError = canSearch && isError;
  const showResults = canSearch && !isFetching && !isError && !isUninitialized;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ResourceListToolbar
        searchId="employees-search"
        searchPlaceholder="Например: Менеджер + Иркутск 1"
        search={search}
        onSearchChange={setSearch}
      />

      {showHint && (
        <DataStateCenter>
          <div className="rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-center text-sm text-gray-600">
            Введите не менее {MIN_QUERY_LENGTH} символов для поиска сотрудника
          </div>
        </DataStateCenter>
      )}

      {showError && <DataMessage type="error" centered />}

      {showLoading && (
        <DataStateCenter>
          <Loader />
        </DataStateCenter>
      )}

      {showResults && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14" />
              <TableHead>ФИО</TableHead>
              <TableHead>Эл. почта</TableHead>
              <TableHead>Телефон</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <ResourceTableEmptyRow
                colSpan={4}
                hasSearch={hasSearch}
                notFoundMessage={`Сотрудник «${debouncedSearch}» не найден`}
              />
            ) : (
              employees.map((employee, index) => (
                <TableRow
                  key={`${employee.cn}-${employee.mail}-${index}`}
                  className="cursor-pointer"
                  onClick={() => setSelected(employee)}
                >
                  <TableCell>
                    <Avatar size="sm">
                      <AvatarImage
                        src={photoSrc(employee.thumbnailphoto)}
                        alt={employee.cn ?? "Сотрудник"}
                      />
                      <AvatarFallback>
                        {getInitials(employee.cn) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {employee.cn ?? "—"}
                  </TableCell>
                  <TableCell>{employee.mail ?? "—"}</TableCell>
                  <TableCell>{employee.telephonenumber ?? "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <EmployeeDetailDialog
        employee={selected}
        attributes={attributes}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}

export default EmployeeDirectory;
