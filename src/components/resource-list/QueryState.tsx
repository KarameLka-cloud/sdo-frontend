import { ReactNode } from "react";
import DataMessage, { DataStateCenter } from "@/components/ui/custom/DataMessage";
import Loader from "@/components/ui/custom/Loader";

interface QueryStateProps {
  isLoading?: boolean;
  isError?: boolean;
  hasData?: boolean;
  children: ReactNode;
  errorMessage?: ReactNode;
  loader?: ReactNode;
}

/** Renders error/loading gates, then children when data is ready. */
function QueryState({
  isLoading = false,
  isError = false,
  hasData = true,
  children,
  errorMessage = <DataMessage type="error" centered />,
  loader = (
    <DataStateCenter>
      <Loader />
    </DataStateCenter>
  ),
}: QueryStateProps) {
  if (isError) return <>{errorMessage}</>;
  if (isLoading) return <>{loader}</>;
  if (!hasData) return null;
  return <>{children}</>;
}

export default QueryState;
