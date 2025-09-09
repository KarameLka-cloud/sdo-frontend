import {JSX} from "react";
import DataMessage from "../DataMessage/DataMessage.tsx";
import Loader from "../Loader/Loader.tsx";

type DataListProps<T> = {
    data: T[] | null | undefined;
    isLoading?: boolean;
    error?: boolean;
    renderItem: (item: T, index: number) => JSX.Element;
    className?: string;
    emptyMessage?: JSX.Element;
    errorMessage?: JSX.Element;
    loader?: JSX.Element;
}

export function DataList<T>({
                                data,
                                isLoading,
                                error,
                                renderItem,
                                className,
                                emptyMessage = <DataMessage type="no_data"/>,
                                errorMessage = <DataMessage type="error"/>,
                                loader = <Loader/>,
                            }: DataListProps<T>) {
    if (error) return errorMessage;
    if (isLoading) return loader;

    if (!data || data.length === 0) {
        return emptyMessage;
    }

    return (
        <div className={className}>
            {data.map((item, index) => renderItem(item, index))}
        </div>
    )
}

export default DataList;
