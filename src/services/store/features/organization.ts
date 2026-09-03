import { API_ENDPOINTS } from "@/constants/api.ts";
import { baseApi } from "../baseApi.ts";
import type { DepartmentType } from "@/interfaces/api/DepartmentType.ts";
import type { PositionType } from "@/interfaces/api/PositionType.ts";

/** Reference data that changes rarely and is reused across learning forms. */
export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<DepartmentType[], void>({
      query: () => API_ENDPOINTS.DEPARTMENTS,
      providesTags: ["Departments"],
    }),
    getPositions: builder.query<PositionType[], void>({
      query: () => API_ENDPOINTS.POSITIONS,
      providesTags: ["Positions"],
    }),
  }),
});

export const { useGetDepartmentsQuery, useGetPositionsQuery } = organizationApi;
