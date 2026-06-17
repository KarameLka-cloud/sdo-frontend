import { ReactNode } from "react";
import Loader from "@/components/ui/custom/Loader";
import DataMessage from "@/components/ui/custom/DataMessage";
import AdminBackLink from "@/pages/Admin/shared/components/AdminBackLink";

interface AdminFormPageProps {
  backTo: string;
  backLabel: string;
  isLoading?: boolean;
  isError?: boolean;
  isNoData?: boolean;
  children: ReactNode;
}

function AdminFormPage({
  backTo,
  backLabel,
  isLoading = false,
  isError = false,
  isNoData = false,
  children,
}: AdminFormPageProps) {
  if (isError) {
    return (
      <div className="flex w-full flex-col gap-6">
        <AdminBackLink to={backTo} label={backLabel} />
        <DataMessage type="error" />
      </div>
    );
  }

  if (isNoData) {
    return (
      <div className="flex w-full flex-col gap-6">
        <AdminBackLink to={backTo} label={backLabel} />
        <DataMessage type="noData" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <AdminBackLink to={backTo} label={backLabel} />
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <AdminBackLink to={backTo} label={backLabel} />
      {children}
    </div>
  );
}

export default AdminFormPage;
