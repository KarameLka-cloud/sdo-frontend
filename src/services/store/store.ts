import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { auth } from "./features/auth.ts";
import { user } from "./features/user.ts";
import { education } from "./features/education.ts";
import { edo } from "./features/edo.ts";

export const store = configureStore({
  reducer: {
    [auth.reducerPath]: auth.reducer,
    [user.reducerPath]: user.reducer,
    [education.reducerPath]: education.reducer,
    [edo.reducerPath]: edo.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      auth.middleware,
      user.middleware,
      education.middleware,
      edo.middleware,
    ),
});

setupListeners(store.dispatch);
