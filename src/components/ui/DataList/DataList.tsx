import {JSX} from "react";
import DataMessage from "../DataMessage/DataMessage.tsx";
import Loader from "../Loader/Loader.tsx";

type DataListProps<T> = {
    data: T[] | null | undefined;
    isLoading?: boolean;
    error?: boolean;
    renderItem: (item: T, index: number) => JSX.Element;
    emptyMessage?: JSX.Element;
    errorMessage?: JSX.Element;
    loader?: JSX.Element;
    maxItems?: number;
}

export function DataList<T>({
                                data,
                                isLoading,
                                error,
                                renderItem,
                                emptyMessage = <DataMessage type="noData"/>,
                                errorMessage = <DataMessage type="error"/>,
                                loader = <Loader/>,
                                maxItems,
                            }: DataListProps<T>) {
    if (error) return errorMessage;
    if (isLoading) return loader;

    if (!data || data.length === 0) {
        return emptyMessage;
    }

    const items = maxItems ? data.slice(0, maxItems) : data;

    return (
        <>
            {items.map((item, index) => renderItem(item, index))}
        </>
    )
}

export default DataList;
