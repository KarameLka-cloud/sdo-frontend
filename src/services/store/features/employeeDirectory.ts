import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@constants/api.ts";
import { baseQuery } from "../baseQuery.ts";
import type { EmployeeDirectorySearchResponse } from "@/interfaces/api/EmployeeDirectoryType.ts";

export const employeeDirectory = createApi({
  reducerPath: "employeeDirectory",
  baseQuery,
  endpoints: (builder) => ({
    searchEmployees: builder.query<
      EmployeeDirectorySearchResponse,
      { q: string; withPhoto?: boolean }
    >({
      query: ({ q, withPhoto = true }) => ({
        url: API_ENDPOINTS.EMPLOYEES_SEARCH,
        params: {
          q,
          with_photo: withPhoto ? 1 : 0,
        },
      }),
    }),
  }),
});

export const { useSearchEmployeesQuery } = employeeDirectory;
