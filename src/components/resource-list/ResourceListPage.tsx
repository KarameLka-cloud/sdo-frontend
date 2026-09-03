import { Key, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import QueryState from "@/components/resource-list/QueryState";
import ResourceListToolbar from "@/components/resource-list/ResourceListToolbar";
import ResourceTableEmptyRow from "@/components/resource-list/ResourceTableEmptyRow";

export interface ResourceColumn<T> {
  key: string;
  label: string;
  className?: string;
  cellTitle?: (item: T) => string | undefined;
  render: (item: T) => ReactNode;
}

interface ResourceListPageProps<T> {
  searchId: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  createTo?: string;
  onCreate?: () => void;
  createLabel?: string;
  toolbarLeftSlot?: ReactNode;

  isLoading?: boolean;
  isError?: boolean;
  hasData?: boolean;

  items: T[];
  columns: ResourceColumn<T>[];
  getRowKey: (item: T) => Key;
  onRowClick?: (item: T) => void;
  renderActions?: (item: T) => ReactNode;

  notFoundMessage: string;
  emptyContent?: ReactNode;

  /** Rendered after the table, typically a create/edit dialog. */
  children?: ReactNode;
}

/**
 * Search toolbar + table shell shared by every resource list screen.
 * Columns describe the body; row click and actions are opt-in.
 */
function ResourceListPage<T>({
  searchId,
  searchPlaceholder,
  search,
  onSearchChange,
  createTo,
  onCreate,
  createLabel,
  toolbarLeftSlot,
  isLoading,
  isError,
  hasData,
  items,
  columns,
  getRowKey,
  onRowClick,
  renderActions,
  notFoundMessage,
  emptyContent,
  children,
}: ResourceListPageProps<T>) {
  const columnCount = columns.length + (renderActions ? 1 : 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ResourceListToolbar
        searchId={searchId}
        searchPlaceholder={searchPlaceholder}
        search={search}
        onSearchChange={onSearchChange}
        createTo={createTo}
        onCreate={onCreate}
        createLabel={createLabel}
        leftSlot={toolbarLeftSlot}
      />

      <QueryState isLoading={isLoading} isError={isError} hasData={hasData}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {renderActions && (
                <TableHead className="text-right">Действия</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <ResourceTableEmptyRow
                colSpan={columnCount}
                hasSearch={search.trim().length > 0}
                notFoundMessage={notFoundMessage}
                emptyContent={emptyContent}
              />
            ) : (
              items.map((item) => (
                <TableRow
                  key={getRowKey(item)}
                  className={onRowClick ? "cursor-pointer select-none" : undefined}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={column.className}
                      title={column.cellTitle?.(item)}
                    >
                      {column.render(item)}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {renderActions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </QueryState>

      {children}
    </div>
  );
}

export default ResourceListPage;
