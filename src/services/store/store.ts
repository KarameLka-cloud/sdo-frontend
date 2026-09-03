import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi.ts";

// Endpoint modules must be imported for their `injectEndpoints` side effect.
import "./features/auth.ts";
import "./features/users.ts";
import "./features/organization.ts";
import "./features/adaptation.ts";
import "./features/learningItems.ts";
import "./features/employeeDirectory.ts";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
