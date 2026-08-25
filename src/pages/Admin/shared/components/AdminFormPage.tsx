import { ReactNode } from "react";
import Loader from "@/components/ui/custom/Loader";
import DataMessage, {
  DataStateCenter,
} from "@/components/ui/custom/DataMessage";
import AdminBackLink from "@/pages/Admin/shared/components/AdminBackLink";
import { cn } from "@/lib/utils";

interface AdminFormPageProps {
  backTo: string;
  backLabel: string;
  isLoading?: boolean;
  isError?: boolean;
  isNoData?: boolean;
  children?: ReactNode;
}

function AdminFormPage({
  backTo,
  backLabel,
  isLoading = false,
  isError = false,
  isNoData = false,
  children,
}: AdminFormPageProps) {
  const isBlocked = isError || isNoData || isLoading;
  const content = isError ? (
    <DataMessage type="error" centered />
  ) : isNoData ? (
    <DataMessage type="noData" centered />
  ) : isLoading ? (
    <DataStateCenter>
      <Loader />
    </DataStateCenter>
  ) : (
    children
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6",
        isBlocked && "min-h-0 flex-1",
      )}
    >
      <AdminBackLink to={backTo} label={backLabel} />
      {content}
    </div>
  );
}

export default AdminFormPage;
