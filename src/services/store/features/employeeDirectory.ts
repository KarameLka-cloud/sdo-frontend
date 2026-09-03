import { API_ENDPOINTS } from "@/constants/api.ts";
import { baseApi } from "../baseApi.ts";
import type { EmployeeDirectorySearchResponse } from "@/interfaces/api/EmployeeDirectoryType.ts";

export const employeeDirectoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchEmployees: builder.query<
      EmployeeDirectorySearchResponse,
      { q: string; withPhoto?: boolean }
    >({
      query: ({ q, withPhoto = true }) => ({
        url: API_ENDPOINTS.EMPLOYEES_SEARCH,
        params: { q, with_photo: withPhoto ? 1 : 0 },
      }),
      // Directory data is external and read-only; keep results briefly.
      keepUnusedDataFor: 120,
    }),
  }),
});

export const { useSearchEmployeesQuery } = employeeDirectoryApi;
