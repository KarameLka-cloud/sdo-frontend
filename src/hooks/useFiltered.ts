import { useMemo } from "react";

export const useFiltered = <T extends object>(
  data: T[] | undefined,
  search: string,
  getSearchText?: (item: T) => string,
): T[] => {
  return useMemo((): T[] => {
    if (!data) return [];
    const searchLower = search.trim().toLowerCase();
    if (!searchLower) return data;

    return data.filter((item) => {
      const haystack = getSearchText
        ? getSearchText(item)
        : Object.values(item).map((value) => String(value ?? "")).join(" ");
      return haystack.toLowerCase().includes(searchLower);
    });
  }, [data, search, getSearchText]);
};
