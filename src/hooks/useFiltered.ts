import { useMemo } from "react";

export const useFiltered = <T extends object>(
  data: T[] | undefined,
  search: string,
): T[] => {
  return useMemo((): T[] => {
    if (!data) return [];
    const searchLower: string = search.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchLower),
      ),
    );
  }, [data, search]);
};
