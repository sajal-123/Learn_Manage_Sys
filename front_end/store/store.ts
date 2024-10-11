'use client'

import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./features/api/ApiSlice"
import authSlice from "./features/auth/authSlice"
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice
    },
    devTools: false, // so that we can use redux devtools but normal user can't 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})