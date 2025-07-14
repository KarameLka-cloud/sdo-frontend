import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

export const education = createApi({
    reducerPath: "education",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_LOCATION,
        prepareHeaders: (headers) => {
            const token = Cookie.get("auth_token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getEducationEvents: builder.query({
            query: () => "api/education/events",
        }),
        addEducationEvents: builder.mutation({
            query: (event) => ({
                url: "api/education/events",
                method: "POST",
                body: event
            })
        }),
    }),
});

export const {useGetEducationEventsQuery, useAddEducationEventsMutation} = education;
