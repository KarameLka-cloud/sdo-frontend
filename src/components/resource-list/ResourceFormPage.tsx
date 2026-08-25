import { ReactNode } from "react";
import Loader from "@/components/ui/custom/Loader";
import DataMessage, {
  DataStateCenter,
} from "@/components/ui/custom/DataMessage";
import ResourceBackLink from "@/components/resource-list/ResourceBackLink";
import { cn } from "@/lib/utils";

interface ResourceFormPageProps {
  backTo: string;
  backLabel: string;
  isLoading?: boolean;
  isError?: boolean;
  isNoData?: boolean;
  children?: ReactNode;
}

function ResourceFormPage({
  backTo,
  backLabel,
  isLoading = false,
  isError = false,
  isNoData = false,
  children,
}: ResourceFormPageProps) {
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
      <ResourceBackLink to={backTo} label={backLabel} />
      {content}
    </div>
  );
}

export default ResourceFormPage;
