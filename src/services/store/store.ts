import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { auth } from "./features/auth.ts";
import { user } from "./features/user.ts";
import { learningItems } from "./features/learningItems.ts";
import { employeeDirectory } from "./features/employeeDirectory.ts";

export const store = configureStore({
  reducer: {
    [auth.reducerPath]: auth.reducer,
    [user.reducerPath]: user.reducer,
    [learningItems.reducerPath]: learningItems.reducer,
    [employeeDirectory.reducerPath]: employeeDirectory.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      auth.middleware,
      user.middleware,
      learningItems.middleware,
      employeeDirectory.middleware,
    ),
});

setupListeners(store.dispatch);
