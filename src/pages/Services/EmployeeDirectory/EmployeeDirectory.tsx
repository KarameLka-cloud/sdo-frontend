import { JSX, useEffect, useMemo, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Field, FieldGroup } from "@/components/ui/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";
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
import AdminTableEmptyRow from "@/pages/Admin/shared/components/AdminTableEmptyRow";

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

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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
              <AvatarFallback>{initials(employee.cn)}</AvatarFallback>
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<EmployeeDirectoryEntry | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [search]);

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

  const resultKey = useMemo(
    () => employees.map((item) => `${item.cn}-${item.mail}-${item.telephonenumber}`),
    [employees],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="sticky mt-10">
        <Card>
          <CardContent>
            <FieldGroup className="flex flex-row items-end justify-end gap-4">
              <Field className="w-full md:w-2/4">
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="employee-directory-search"
                    placeholder="Например: Менеджер + Иркутск 1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {hasSearch && (
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label="Очистить поиск"
                        onClick={() => setSearch("")}
                      >
                        <XIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

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
              <TableHead>Телефон</TableHead>
              <TableHead>Эл. почта</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={4}
                hasSearch={hasSearch}
                notFoundMessage={`Сотрудник «${debouncedSearch}» не найден`}
              />
            ) : (
              employees.map((employee, index) => (
                <TableRow
                  key={`${resultKey[index]}-${index}`}
                  className="cursor-pointer"
                  onClick={() => setSelected(employee)}
                >
                  <TableCell>
                    <Avatar size="sm">
                      <AvatarImage
                        src={photoSrc(employee.thumbnailphoto)}
                        alt={employee.cn ?? "Сотрудник"}
                      />
                      <AvatarFallback>{initials(employee.cn)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {employee.cn ?? "—"}
                  </TableCell>
                  <TableCell>{employee.telephonenumber ?? "—"}</TableCell>
                  <TableCell>{employee.mail ?? "—"}</TableCell>
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
