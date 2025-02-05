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


// call the refresh token function on every page load

const initializeApp=async()=>{
    await store.dispatch(apiSlice.endpoints.refreshToken.initiate({},{forceRefetch:true}));
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({},{forceRefetch:true}));
}

initializeApp();