import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {userApi} from "./features/userApi";
import {educationApi} from "./features/educationApi";
import {edoApi} from "./features/edoApi";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [educationApi.reducerPath]: educationApi.reducer,
        [edoApi.reducerPath]: edoApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            educationApi.middleware,
            edoApi.middleware
        ),
});

setupListeners(store.dispatch);
