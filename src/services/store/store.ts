import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {login, logout} from "./features/auth.ts";
import {user} from "./features/user.ts";
import {education} from "./features/education.ts";
import {edo} from "./features/edo.ts";

export const store = configureStore({
    reducer: {
        [login.reducerPath]: login.reducer,
        [logout.reducerPath]: logout.reducer,
        [user.reducerPath]: user.reducer,
        [education.reducerPath]: education.reducer,
        [edo.reducerPath]: edo.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            login.middleware,
            logout.middleware,
            user.middleware,
            education.middleware,
            edo.middleware
        ),
});

setupListeners(store.dispatch);
