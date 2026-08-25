import { ReactNode } from "react";
import DataMessage from "@/components/ui/custom/DataMessage";
import { TableCell, TableRow } from "@/components/ui/shadcn/table";

interface AdminTableEmptyRowProps {
  colSpan: number;
  hasSearch: boolean;
  notFoundMessage: string;
  emptyContent?: ReactNode;
}

function AdminTableEmptyRow({
  colSpan,
  hasSearch,
  notFoundMessage,
  emptyContent,
}: AdminTableEmptyRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="p-0">
        <div className="flex items-center justify-center px-4 py-16">
          {hasSearch ? (
            <p className="text-sm text-muted-foreground">{notFoundMessage}</p>
          ) : (
            (emptyContent ?? <DataMessage type="noData" />)
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default AdminTableEmptyRow;
