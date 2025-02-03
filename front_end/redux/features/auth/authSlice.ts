import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    token: "",
    user: ""
}

const authSlice = createSlice({
    name: "auth",
    initialState, // Corrected spelling here
    reducers: {
        userRegistration: (state, action:PayloadAction<{token:string}>) => {
            state.token = action.payload.token
        },
        userLoggedIn: (state, action:PayloadAction<{accessToken:string,user:string}>) => {
            state.token = action.payload.accessToken
            state.user = action.payload.user
        },
        userLoggedOut: (state) => {
            state.token = "" // Corrected state update
            state.user = ""  // Corrected state update
        },
    }
})

export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
