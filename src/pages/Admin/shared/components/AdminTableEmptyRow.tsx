import { ReactNode } from "react";
import DataMessage from "@/components/ui/custom/DataMessage";
import { TableCell, TableRow } from "@/components/ui/table";

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
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {hasSearch ? (
          <p className="text-sm text-muted-foreground">{notFoundMessage}</p>
        ) : (
          emptyContent ?? <DataMessage type="noData" />
        )}
      </TableCell>
    </TableRow>
  );
}

export default AdminTableEmptyRow;
