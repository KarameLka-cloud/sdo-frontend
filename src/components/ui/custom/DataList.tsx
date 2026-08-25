import { JSX } from "react";
import DataMessage, { DataStateCenter } from "./DataMessage.tsx";
import Loader from "./Loader.tsx";

type DataListProps<T> = {
  data: T[] | null | undefined;
  isLoading?: boolean;
  error?: boolean;
  renderItem: (item: T, index: number) => JSX.Element;
  emptyMessage?: JSX.Element;
  errorMessage?: JSX.Element;
  loader?: JSX.Element;
};

function DataList<T>({
  data,
  isLoading,
  error,
  renderItem,
  emptyMessage = <DataMessage type="noData" centered />,
  errorMessage = <DataMessage type="error" centered />,
  loader = (
    <DataStateCenter>
      <Loader />
    </DataStateCenter>
  ),
}: DataListProps<T>) {
  if (error) return errorMessage;
  if (isLoading) return loader;

  if (!data || data.length === 0) {
    return emptyMessage;
  }

  return <>{data.map((item, index) => renderItem(item, index))}</>;
}

export default DataList;
