import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery.ts";

/**
 * Single RTK Query API. Feature modules attach their endpoints with
 * `injectEndpoints`, so the store needs only one reducer and one middleware
 * and tags can be invalidated across feature boundaries.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "CurrentUser",
    "Users",
    "Roles",
    "Departments",
    "Positions",
    "AdaptationPlans",
    "MyAdaptationPlan",
    "AdaptationPlanTemplates",
    "LearningItems",
  ],
  endpoints: () => ({}),
});
